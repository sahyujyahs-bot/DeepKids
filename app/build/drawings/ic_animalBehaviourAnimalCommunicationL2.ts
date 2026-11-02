import type { Ctx } from "./core";
import { INK, COL, SKIN, CLOTH, WHITE, RED, ground, shape, shade, ell, rrect, polyP, shadow, line, arrow, write, person, hand, cards } from "./flatKit";

const BLUE = COL.blueDk, DOG = "#a8723f", DOGDK = "#7d522b", CAT = "#9a9aa6", CATDK = "#74748a", CROW = "#3a3540", CROWDK = "#26222e";
const FACE = { angry: "#f2907a", happy: "#ffd34d" };

// sound arcs leaving a point, opening towards the right (dir = 1) or left (dir = -1)
const arcs = (c: Ctx, x: number, y: number, r0: number, n: number, dir = 1, col: string = BLUE, w = 8) => {
  for (let i = 0; i < n; i++) { c.beginPath(); c.arc(x, y, r0 + i * 34, dir > 0 ? -0.65 : Math.PI - 0.65, dir > 0 ? 0.65 : Math.PI + 0.65); c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.stroke(); }
};
const wavy = (c: Ctx, x0: number, x1: number, y: number, amp: number, cycles: number, w: number, col: string = BLUE) => {
  c.beginPath(); for (let i = 0; i <= 120; i++) { const t = i / 120, x = x0 + (x1 - x0) * t, yy = y + Math.sin(t * cycles * Math.PI * 2) * amp; i ? c.lineTo(x, yy) : c.moveTo(x, yy); }
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round"; c.stroke();
};
const jag = (c: Ctx, x0: number, x1: number, y: number, amp: number, n: number, w: number, col: string = INK) => {
  const pts: number[][] = []; for (let i = 0; i <= n; i++) pts.push([x0 + ((x1 - x0) * i) / n, y + (i % 2 ? amp : -amp)]); line(c, pts, w, col);
};
const face = (c: Ctx, x: number, y: number, r: number, kind: "angry" | "happy") => {
  shape(c, () => ell(c, x, y, r, r), FACE[kind], 5);
  const e = r * 0.34, ey = y - r * 0.12;
  for (const s of [-1, 1]) shape(c, () => ell(c, x + s * e, ey, r * 0.09, r * 0.13), INK, 0);
  if (kind === "angry") {
    line(c, [[x - e - r * 0.25, ey - r * 0.42], [x - e + r * 0.2, ey - r * 0.2]], 6); line(c, [[x + e + r * 0.25, ey - r * 0.42], [x + e - r * 0.2, ey - r * 0.2]], 6);
    c.beginPath(); c.arc(x, y + r * 0.7, r * 0.32, Math.PI * 1.15, Math.PI * 1.85); c.strokeStyle = INK; c.lineWidth = 6; c.lineCap = "round"; c.stroke();
  } else { c.beginPath(); c.arc(x, y + r * 0.1, r * 0.5, 0.25, Math.PI - 0.25); c.strokeStyle = INK; c.lineWidth = 6; c.lineCap = "round"; c.stroke(); }
};

// a dog facing right, feet on y; s = size
const dog = (c: Ctx, x: number, y: number, s: number, mouth: boolean, tailUp: boolean, flip = false) => {
  shadow(c, x + 30 * s, y + 6, 230 * s, 24 * s);
  c.save(); c.translate(x, y); c.scale(flip ? -s : s, s);
  line(c, [[-185, -200], [-245, tailUp ? -300 : -150]], 40, INK); line(c, [[-185, -200], [-245, tailUp ? -300 : -150]], 28, DOG);
  for (const lx of [-150, -105, 95, 140]) shape(c, () => rrect(c, lx - 20, -120, 40, 120, 14), lx < 0 ? DOGDK : DOG, 6);
  shape(c, () => ell(c, 0, -190, 205, 95), DOG, 6); shade(c, () => ell(c, 0, -190, 205, 95), DOGDK, 25, 30);
  shape(c, () => ell(c, 175, -280, 80, 80), DOG, 6);
  if (mouth) { shape(c, () => ell(c, 255, -228, 62, 24, 0.35), DOGDK, 6); shape(c, () => polyP(c, [[235, -262], [330, -262], [305, -225], [240, -215]]), "#b8403a", 4); }
  shape(c, () => ell(c, 255, -285, 72, 36, mouth ? -0.18 : 0.05), DOG, 6);
  shape(c, () => ell(c, 320, mouth ? -312 : -295, 17, 13), INK, 0);
  shape(c, () => polyP(c, [[130, -330], [180, -345], [190, -250], [135, -240]]), DOGDK, 6);
  shape(c, () => ell(c, 205, -305, 10, 13), INK, 0);
  c.restore();
};

// a hen facing left, feet on y
const hen = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + 20 * s, y + 6, 170 * s, 20 * s);
  c.save(); c.translate(x, y); c.scale(s, s);
  for (const lx of [-20, 40]) { line(c, [[lx, -70], [lx, 0]], 14, INK); line(c, [[lx, -70], [lx, 0]], 6, COL.orange); line(c, [[lx - 30, 0], [lx + 5, 0]], 12, INK); line(c, [[lx - 30, 0], [lx + 5, 0]], 5, COL.orange); }
  shape(c, () => polyP(c, [[110, -200], [210, -330], [190, -210], [235, -250], [170, -130]]), "#8a3d2b", 6);
  shape(c, () => ell(c, 20, -150, 150, 105, 0.12), COL.red, 6); shade(c, () => ell(c, 20, -150, 150, 105, 0.12), "#a83b28", 30, 30);
  shape(c, () => ell(c, 40, -140, 85, 50, 0.2), "#c0432d", 5);
  shape(c, () => ell(c, -105, -270, 62, 58), COL.red, 6);
  for (const cx of [-125, -100, -75]) shape(c, () => ell(c, cx, -325, 18, 24), RED, 5);
  shape(c, () => polyP(c, [[-155, -270], [-225, -285], [-160, -255]]), COL.yellow, 5);
  shape(c, () => polyP(c, [[-155, -250], [-215, -235], [-158, -240]]), COL.yellow, 5);
  shape(c, () => ell(c, -150, -225, 12, 20), RED, 4);
  shape(c, () => ell(c, -112, -280, 9, 12), INK, 0);
  c.restore();
};
// a chick on y, facing dir (1 = right)
const chick = (c: Ctx, x: number, y: number, s: number, dir = 1) => {
  shadow(c, x, y + 4, 42 * s, 8 * s);
  c.save(); c.translate(x, y); c.scale(dir * s, s);
  for (const lx of [-8, 12]) { line(c, [[lx, -22], [lx + 6, 0]], 8, INK); line(c, [[lx + 6, 0], [lx + 18, 0]], 8, INK); }
  shape(c, () => ell(c, 0, -48, 40, 34), COL.yellow, 5); shade(c, () => ell(c, 0, -48, 40, 34), COL.orange, 12, 12, 0.4);
  shape(c, () => ell(c, 28, -82, 26, 24), COL.yellow, 5);
  shape(c, () => polyP(c, [[50, -86], [72, -80], [50, -74]]), COL.orange, 4);
  shape(c, () => ell(c, 34, -90, 4.5, 6), INK, 0);
  c.restore();
};
// a crow facing left standing on y
const crow = (c: Ctx, x: number, y: number, s: number, open: boolean, flight = false) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  if (flight) {
    shape(c, () => polyP(c, [[-10, -110], [90, -250], [200, -250], [110, -120]]), CROWDK, 6);
    shape(c, () => polyP(c, [[110, -150], [230, -110], [220, -70], [100, -100]]), CROWDK, 6);
  } else for (const lx of [-8, 28]) line(c, [[lx, -60], [lx, 0]], 9, INK);
  shape(c, () => ell(c, 40, -110, 110, 60, flight ? -0.45 : 0.25), CROW, 6); shade(c, () => ell(c, 40, -110, 110, 60, flight ? -0.45 : 0.25), CROWDK, 20, 20);
  shape(c, () => ell(c, -70, -170, 42, 40), CROW, 6);
  if (open) { shape(c, () => polyP(c, [[-105, -180], [-190, -190], [-110, -168]]), CROWDK, 5); shape(c, () => polyP(c, [[-105, -165], [-180, -135], [-108, -152]]), CROWDK, 5); shape(c, () => polyP(c, [[-108, -168], [-180, -188], [-178, -138], [-108, -152]]), "#b8403a", 0); }
  else shape(c, () => polyP(c, [[-105, -182], [-190, -165], [-105, -150]]), CROWDK, 5);
  shape(c, () => ell(c, -76, -178, 8, 10), WHITE, 3); shape(c, () => ell(c, -78, -178, 4, 5), INK, 0);
  c.restore();
};
const cat = (c: Ctx, x: number, y: number, s: number) => {
  shadow(c, x + 20 * s, y + 6, 100 * s, 14 * s);
  c.save(); c.translate(x, y); c.scale(s, s);
  line(c, [[55, -20], [120, -25], [130, -90]], 22, INK); line(c, [[55, -20], [120, -25], [130, -90]], 14, CAT);
  shape(c, () => ell(c, 0, -85, 70, 85), CAT); shade(c, () => ell(c, 0, -85, 70, 85), CATDK, 20, 14);
  shape(c, () => ell(c, 0, -170, 55, 50), CAT);
  shape(c, () => polyP(c, [[-52, -195], [-48, -250], [-12, -208]]), CAT, 5); shape(c, () => polyP(c, [[12, -208], [48, -250], [52, -195]]), CAT, 5);
  for (const ex of [-20, 20]) { shape(c, () => ell(c, ex, -175, 7, 9), COL.yellow, 3); shape(c, () => ell(c, ex, -175, 3, 7), INK, 0); }
  shape(c, () => ell(c, 0, -158, 6, 4), COL.pink, 2);
  c.restore();
};
const wire = (c: Ctx, y: number) => { line(c, [[0, y - 10], [540, y + 10], [1080, y - 10]], 12); line(c, [[0, y - 10], [540, y + 10], [1080, y - 10]], 5, COL.greyDk); };

// 0. flow.e1 - the la-la test: a girl listens; sound comes from behind a door
const e1 = (c: Ctx) => {
  ground(c, "#f2e6ca"); c.fillStyle = "#d6c3a2"; c.fillRect(0, 900, 1080, 180);
  shape(c, () => rrect(c, 590, 120, 380, 780, 6), "#cdb994", 7);
  shape(c, () => rrect(c, 630, 160, 300, 740, 4), "#4a3f66", 5);
  shape(c, () => polyP(c, [[630, 160], [790, 215], [790, 840], [630, 900]]), COL.wood, 6);
  shade(c, () => polyP(c, [[630, 160], [790, 215], [790, 840], [630, 900]]), COL.woodDk, 25, 0, 0.5);
  shape(c, () => ell(c, 760, 560, 14, 14), COL.yellow, 4);
  arcs(c, 820, 520, 40, 3, -1);
  const gx = 250, gy = 930, gh = 700;
  person(c, gx, gy, gh, { armL: [1.9, 1.7], armR: [0.5, -2.6] });
  const hy = gy - gh * 0.74 - gh * 0.13 * 1.05;
  shape(c, () => ell(c, gx + 105, hy + 5, 30, 46, 0.15), SKIN.child, 5);
  arrow(c, [[560, 330], [440, 330]]);
};

// 1. flow.a1 - hum a purr: fingers on the throat
const a1 = (c: Ctx) => {
  ground(c);
  const px = 340, py = 1040, ph = 820, sh = py - ph * 0.74, head = ph * 0.13, hy = sh - head * 1.05;
  person(c, px, py, ph, { armL: [2.0, 1.8] });
  const fx = px + 8, fy = sh + 4, A: number[][] = [[px + ph * 0.11, sh + ph * 0.03], [px + ph * 0.27, sh + ph * 0.1], [fx + 34, fy + 14]];
  line(c, A, 38, INK); line(c, A, 28, CLOTH.child);
  shape(c, () => ell(c, fx, fy, 40, 26, 0.25), SKIN.child, 5);
  for (const s of [-1, 1]) { c.beginPath(); c.arc(fx, fy - 4, 62 + (s > 0 ? 0 : 0), s > 0 ? -0.5 : Math.PI - 0.5, s > 0 ? 0.5 : Math.PI + 0.5); c.strokeStyle = RED; c.lineWidth = 7; c.lineCap = "round"; c.stroke(); }
  const mx = px + 18, my = hy + head * 0.38;
  shape(c, () => ell(c, mx, my + 6, 22, 14), "#6b2f2a", 4);
  arcs(c, mx + 10, my, 60, 3, 1);
  // a cat purrs with the same buzz
  cat(c, 810, 900, 1.8);
  for (const s of [-1, 1]) { c.beginPath(); c.arc(810, 745, 130, s > 0 ? -0.45 : Math.PI - 0.45, s > 0 ? 0.45 : Math.PI + 0.45); c.strokeStyle = RED; c.lineWidth = 7; c.lineCap = "round"; c.stroke(); }
};

// 2. flow.a2 - comb chirp and pencil drumming
const a2 = (c: Ctx) => {
  ground(c);
  // comb
  shadow(c, 330, 560, 250, 20);
  shape(c, () => rrect(c, 90, 330, 480, 80, 14), "#3fb1a8", 6);
  for (let i = 0; i < 14; i++) shape(c, () => rrect(c, 100 + i * 33, 405, 20, 120, 8), "#3fb1a8", 5);
  // card scraping along the teeth
  c.save(); c.translate(340, 485); c.rotate(-0.1);
  shape(c, () => rrect(c, -130, -50, 260, 80, 8), COL.paper, 6); c.restore();
  arrow(c, [[160, 270], [500, 270]]);
  arcs(c, 590, 440, 30, 2, 1);
  // box and pencil
  shadow(c, 800, 960, 220, 24);
  shape(c, () => polyP(c, [[600, 700], [1000, 700], [1030, 780], [630, 780]]), "#d9b27c", 6);
  shape(c, () => polyP(c, [[630, 780], [1030, 780], [1030, 940], [630, 940]]), COL.brown, 6);
  c.save(); c.translate(820, 580); c.rotate(0.7);
  shape(c, () => rrect(c, -150, -16, 260, 32, 6), COL.yellow, 5);
  shape(c, () => polyP(c, [[110, -16], [160, 0], [110, 16]]), "#f3d9b0", 4);
  c.restore();
  arrow(c, [[920, 590], [920, 650]]);
  arcs(c, 830, 740, 90, 2, 1);
};

// 3. flow.p1 - a crow, a notebook with three days
const p1 = (c: Ctx) => {
  ground(c);
  wire(c, 330);
  crow(c, 540, 332, 1.5, true);
  arcs(c, 280, 140, 30, 3, -1);
  shadow(c, 540, 930, 450, 26);
  shape(c, () => rrect(c, 80, 500, 920, 420, 22), COL.paper, 7);
  for (const x of [387, 693]) line(c, [[x, 520], [x, 900]], 4, COL.greyDk);
  [0, 1, 2].forEach((i) => {
    const x0 = 100 + i * 306;
    write(c, String(i + 1), x0 + 125, 530, 70, INK, 8);
    const n = i + 1;
    for (let k = 0; k < n + 1; k++) wavy(c, x0 + 20, x0 + 270, 680 + k * 55, 14, 3, 6);
  });
};

// 4. term.0 - Communicate: a hen clucks, chicks run to her
const term0 = (c: Ctx) => {
  ground(c, "#e8dcc0"); c.fillStyle = "#cfe0a0"; c.fillRect(0, 700, 1080, 380);
  hen(c, 740, 900, 1.35);
  arcs(c, 520, 640, 30, 3, -1);
  [[110, 960, 1.15], [230, 840, 1.0], [330, 940, 1.15], [430, 800, 0.95], [140, 780, 0.9]].forEach(([x, y, s]) => chick(c, x, y, s, 1));
  arrow(c, [[250, 1040], [520, 1040]]);
};

// 5. term.6 - Pitch: a puppy's fast tight wave, a big dog's slow wide wave
const term6 = (c: Ctx) => {
  ground(c);
  line(c, [[540, 60], [540, 1020]], 5, COL.grey);
  dog(c, 190, 900, 0.55, true, true);
  dog(c, 640, 900, 0.8, true, false);
  wavy(c, 40, 500, 560, 20, 10, 6, COL.teal);
  wavy(c, 580, 1040, 560, 40, 2.5, 16, BLUE);
};

// 6. term.7 - Vibrate: a ruler twanged over a table edge
const term7 = (c: Ctx) => {
  ground(c);
  shadow(c, 400, 880, 360, 24);
  shape(c, () => rrect(c, 40, 560, 560, 70, 12), COL.brown, 6);
  shape(c, () => rrect(c, 80, 630, 70, 270, 10), COL.brown, 6); shape(c, () => rrect(c, 500, 630, 70, 270, 10), COL.brown, 6);
  const ruler = (rot: number, alpha: number) => {
    c.save(); c.globalAlpha = alpha; c.translate(320, 548); c.rotate(rot);
    shape(c, () => rrect(c, -210, -20, 760, 40, 6), COL.wood, 6);
    for (let i = 0; i < 12; i++) line(c, [[-190 + i * 60, -20], [-190 + i * 60, i % 2 ? -4 : 6]], 3);
    c.restore(); c.globalAlpha = 1;
  };
  ruler(-0.2, 0.35); ruler(0.2, 0.35);
  ruler(0, 1);
  hand(c, 210, 365, Math.PI / 2, 1.6, SKIN.child, CLOTH.child, true);
  arrow(c, [[860, 460], [860, 360]]); arrow(c, [[860, 460], [860, 560]]);
  arcs(c, 890, 480, 80, 2, 1);
};

// 7. expl.0 - a sender and a receiver: one crow caws at a cat, another lifts off
const expl0 = (c: Ctx) => {
  ground(c, "#e8f0f6");
  wire(c, 330);
  crow(c, 800, 332, 1.4, true);
  arcs(c, 520, 160, 30, 3, -1);
  crow(c, 300, 330, 0.9, false, true);
  arrow(c, [[60, 250], [60, 110]]);
  c.fillStyle = "#cfe0a0"; c.fillRect(0, 930, 1080, 150);
  cat(c, 780, 1040, 1.45);
};

// 8. expl.4 - the same dog twice: low rough = go away, high soft = come and play
const expl4 = (c: Ctx) => {
  ground(c);
  line(c, [[540, 60], [540, 1020]], 5, COL.grey);
  dog(c, 230, 940, 0.75, true, false);
  dog(c, 770, 940, 0.75, true, true);
  face(c, 270, 150, 100, "angry"); face(c, 810, 150, 100, "happy");
  jag(c, 40, 500, 420, 60, 8, 14, INK);
  wavy(c, 580, 1040, 420, 22, 6, 7, COL.teal);
};

export const ic_animalBehaviourAnimalCommunicationL2 = cards("sci.animal-behaviour.animal-communication.L2 cards", [e1, a1, a2, p1, term0, term6, term7, expl0, expl4]);
