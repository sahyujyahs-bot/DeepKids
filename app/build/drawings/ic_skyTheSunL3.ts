import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, glass, bowl, leaf, write, cards } from "./flatKit";

// sci.sky.the-sun.L3 · picture cards (flows, terms, explanations). Sunlight is yellow beams with an
// arrowhead, heat is red wavy lines, the Sun is a yellow ball. Same child and grown-up as the set-up cards.

const SUN = "#ffc93c", SUNDK = "#f2a024", BEAM = "#ffe066", WALL = "#f7edd6", FLOOR = "#e6d3a8", DARK = "#2e2a38", CHOC = "#5a3a22";
const NONE = "rgba(0,0,0,0)";

const sunBall = (c: Ctx, x: number, y: number, r: number, rays = true, col = SUN, dk = SUNDK) => {
  if (rays) for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6 + 0.2; line(c, [[x + Math.cos(a) * r * 1.2, y + Math.sin(a) * r * 1.2], [x + Math.cos(a) * r * 1.55, y + Math.sin(a) * r * 1.55]], 16, INK); line(c, [[x + Math.cos(a) * r * 1.2, y + Math.sin(a) * r * 1.2], [x + Math.cos(a) * r * 1.55, y + Math.sin(a) * r * 1.55]], 9, col); }
  shape(c, () => ell(c, x, y, r, r), col, 6);
  shade(c, () => ell(c, x, y, r, r), dk, r * 0.18, r * 0.18);
  shine(c, [[x - r * 0.55, y - r * 0.2], [x - r * 0.3, y - r * 0.55]], Math.max(5, r * 0.09));
};
// a beam of sunlight with a small arrowhead at its end
const beam = (c: Ctx, pts: number[][], w = 8, head = true, col: string = BEAM) => {
  line(c, pts, w + 6, INK); line(c, pts, w, col);
  if (!head) return;
  const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]], an = Math.atan2(b[1] - a[1], b[0] - a[0]), h = w * 2.6;
  shape(c, () => polyP(c, [b, [b[0] - Math.cos(an - 0.45) * h, b[1] - Math.sin(an - 0.45) * h], [b[0] - Math.cos(an + 0.45) * h, b[1] - Math.sin(an + 0.45) * h]]), col, 4);
};
// heat: red wavy lines rising from (x, y)
const heat = (c: Ctx, x: number, y: number, h: number, w = 8, amp = 12) => {
  const p: number[][] = []; for (let i = 0; i <= 24; i++) p.push([x + Math.sin(i * 0.6) * amp, y - (i / 24) * h]);
  line(c, p, w, RED);
};
const earth = (c: Ctx, x: number, y: number, r: number) => {
  const b = () => ell(c, x, y, r, r);
  shape(c, b, COL.blue, Math.max(3, r * 0.05));
  c.save(); c.beginPath(); b(); c.clip();
  for (const [u, v, s] of [[-0.3, -0.25, 0.4], [0.35, 0.2, 0.34], [-0.1, 0.5, 0.2]]) { c.beginPath(); ell(c, x + u * r, y + v * r, s * r, s * r * 0.75, 0.5); c.fillStyle = COL.green; c.fill(); }
  c.restore(); shade(c, b, COL.blueDk, r * 0.25, r * 0.25, 0.4); c.beginPath(); b(); c.lineWidth = Math.max(3, r * 0.05); c.strokeStyle = INK; c.stroke();
};
// a magnifying glass seen from the side: lens at (x, y), half-width rx, handle toward the right
const magnifier = (c: Ctx, x: number, y: number, rx: number, ry: number, handleLen = 220) => {
  line(c, [[x + rx, y + 4], [x + rx + handleLen, y + 14]], 36, INK); line(c, [[x + rx, y + 4], [x + rx + handleLen, y + 14]], 24, COL.brown);
  shape(c, () => ell(c, x, y, rx + 12, ry + 14), COL.steel, 6);
  shape(c, () => ell(c, x, y, rx, ry), "rgba(214,236,250,0.8)", 5);
  shine(c, [[x - rx * 0.6, y - ry * 0.2], [x - rx * 0.2, y - ry * 0.45]], 7);
};
// beams of sunlight falling straight down through a lens at (lx, ly) to a focus point (fx, fy)
const lensBeams = (c: Ctx, lx: number, ly: number, hw: number, topY: number, fx: number, fy: number) => {
  for (const k of [-1, -0.5, 0, 0.5, 1]) { const x = lx + k * hw * 0.85; line(c, [[x, topY], [x, ly]], 14, INK); line(c, [[x, ly], [fx, fy]], 14, INK); }
  for (const k of [-1, -0.5, 0, 0.5, 1]) { const x = lx + k * hw * 0.85; line(c, [[x, topY], [x, ly]], 8, BEAM); line(c, [[x, ly], [fx, fy]], 8, BEAM); }
};
const smoke = (c: Ctx, x: number, y: number, h: number) => {
  const p: number[][] = []; for (let i = 0; i <= 20; i++) p.push([x + Math.sin(i * 0.5) * (6 + i * 1.6), y - (i / 20) * h]);
  line(c, p, 18, INK); line(c, p, 10, "#d8d6dc");
};
const spot = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), "#fff6c2", 0); shape(c, () => ell(c, x, y, r * 0.65, r * 0.65), "#fffbe3", 0);
};
const sheet = (c: Ctx, x: number, y: number, w: number, h: number, sk: number, col: string, dk: string) => {
  const p = () => polyP(c, [[x + sk, y], [x + w + sk, y], [x + w, y + h], [x, y + h]]);
  shape(c, p, col, 6); shade(c, p, dk, 0, h * 0.0, 0);
};
const table = (c: Ctx, y: number) => {
  shape(c, () => rrect(c, -20, y, 1120, 70, 4), COL.wood, 6);
  c.fillStyle = COL.woodDk; c.fillRect(-14, y + 44, 1108, 20); line(c, [[-14, y + 64], [1094, y + 64]], 6);
};
const iceCube = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => rrect(c, x - s / 2, y - s, s, s, s * 0.12), "#d9f0fb", 6);
  shape(c, () => polyP(c, [[x - s / 2, y - s], [x - s / 2 + s * 0.25, y - s * 1.22], [x + s / 2 + s * 0.25, y - s * 1.22], [x + s / 2, y - s]]), "#f1fbff", 6);
  shine(c, [[x - s * 0.3, y - s * 0.8], [x - s * 0.3, y - s * 0.4]], 8);
};
const star5 = (c: Ctx, x: number, y: number, r: number) => { const p: number[][] = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; p.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); } polyP(c, p); };
const tick = (c: Ctx, x: number, y: number, s: number) => line(c, [[x - s, y], [x - s * 0.3, y + s * 0.7], [x + s, y - s * 0.8]], 22, "#3c9a3c");

// ================================================================ flows
// e1: a lens gathers sunlight into a tiny dot on black paper; a thread of smoke; the tumbler of water
const flowE1 = (c: Ctx) => {
  ground(c);
  sunBall(c, 500, 120, 80);
  shadow(c, 560, 930, 430, 70);
  shape(c, () => ell(c, 540, 880, 420, 100), COL.steel, 6);
  shape(c, () => ell(c, 540, 874, 380, 80), COL.steelIn, 4);
  shape(c, () => polyP(c, [[330, 840], [750, 840], [820, 900], [260, 900]]), DARK, 6);
  lensBeams(c, 500, 500, 150, 250, 500, 870);
  shape(c, () => ell(c, 500, 870, 18, 9), "#fffbe3", 4);
  smoke(c, 550, 860, 190);
  magnifier(c, 500, 500, 170, 28, 190);
  hand(c, 1010, 520, Math.PI, 1.15, SKIN.adult, CLOTH.adult);
  glass(c, 130, 1000, 130, 190, 0.8);
};
// e2: ice on black paper and on white paper in the sun: the one on black melts faster
const flowE2 = (c: Ctx) => {
  ground(c);
  sunBall(c, 540, 110, 75);
  for (const x of [290, 790]) { shadow(c, x + 20, 800, 240, 70); shape(c, () => ell(c, x, 770, 240, 100), COL.steel, 6); shape(c, () => ell(c, x, 766, 205, 82), COL.steelIn, 4); }
  shape(c, () => polyP(c, [[130, 740], [450, 740], [490, 800], [90, 800]]), DARK, 6);
  shape(c, () => polyP(c, [[630, 740], [950, 740], [990, 800], [590, 800]]), WHITE, 6);
  shape(c, () => ell(c, 290, 772, 160, 24), COL.water, 0); shape(c, () => ell(c, 790, 772, 55, 10), COL.water, 0);
  iceCube(c, 290, 770, 60); iceCube(c, 790, 790, 150);
  for (const x of [290, 790]) { beam(c, [[x - 70, 260], [x - 70, 560]]); beam(c, [[x + 70, 260], [x + 70, 560]]); }
  heat(c, 190, 700, 70, 7); heat(c, 400, 700, 70, 7);
};
// a1: half in the sunlight, half in the shade
const flowA1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = WALL; c.fillRect(0, 0, D, 640); c.fillStyle = FLOOR; c.fillRect(0, 640, D, 440); line(c, [[0, 640], [D, 640]], 6);
  shape(c, () => rrect(c, 90, 90, 320, 430, 8), COL.wood, 8); shape(c, () => rrect(c, 120, 120, 260, 370, 4), COL.sky, 5);
  sunBall(c, 250, 250, 55, false);
  c.fillStyle = "rgba(255,226,120,0.45)"; c.beginPath(); polyP(c, [[120, 490], [380, 490], [700, 960], [300, 960]]); c.fill();
  shape(c, () => polyP(c, [[240, 740], [640, 740], [740, 960], [300, 960]]), "#ffe9a0", 6);
  c.fillStyle = "rgba(43,35,64,0.14)"; c.beginPath(); polyP(c, [[640, 740], [1080, 740], [1080, 1080], [740, 1080], [740, 960]]); c.fill();
  shadow(c, 600, 980, 150, 24);
  person(c, 560, 970, 560, { armL: [Math.PI * 0.85, Math.PI * 0.95], armR: [Math.PI * 0.15, Math.PI * 0.05] });
};
// a2: a mirror with a paper cover and a tiny hole sends a round spot of light to a shady wall
const flowA2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = FLOOR; c.fillRect(0, 880, D, 200); c.fillStyle = "#f3ede0"; c.fillRect(700, 0, 380, 880); line(c, [[700, 0], [700, 880]], 6); line(c, [[0, 880], [D, 880]], 6);
  c.fillStyle = "rgba(43,35,64,0.10)"; c.fillRect(700, 0, 380, 880);
  sunBall(c, 130, 130, 70);
  beam(c, [[190, 190], [300, 640]], 8);
  beam(c, [[318, 640], [790, 330]], 8);
  spot(c, 890, 300, 85); shape(c, () => ell(c, 890, 300, 85, 85), NONE, 5);
  c.save(); c.translate(300, 650); c.rotate(-0.35);
  shape(c, () => rrect(c, -85, -85, 170, 170, 10), WHITE, 7); shape(c, () => rrect(c, -9, -9, 18, 18, 2), "#1a1620", 3);
  c.restore();
  hand(c, 300, 860, -Math.PI / 2, 1.2, SKIN.child, CLOTH.child);
};
// a3: home hunt: curtain, poster and newspaper that the Sun has faded; a child with a notebook
const flowA3 = (c: Ctx) => {
  ground(c);
  c.fillStyle = WALL; c.fillRect(0, 0, D, 840); c.fillStyle = FLOOR; c.fillRect(0, 840, D, 240); line(c, [[0, 840], [D, 840]], 6);
  shape(c, () => rrect(c, 70, 100, 300, 400, 8), COL.wood, 8); shape(c, () => rrect(c, 100, 130, 240, 340, 4), COL.sky, 5); sunBall(c, 220, 260, 50, false);
  const cur = () => rrect(c, 380, 70, 190, 520, 10);
  shape(c, cur, "#d94f6b", 6);
  c.save(); c.beginPath(); cur(); c.clip(); c.fillStyle = "#f2c1cc"; c.fillRect(380, 70, 62, 520); c.restore();
  for (const x of [445, 490, 535]) line(c, [[x, 90], [x, 570]], 4, "#b23c55");
  shape(c, cur, NONE, 6);
  shape(c, () => rrect(c, 650, 110, 330, 400, 6), WHITE, 7);
  shape(c, () => star5(c, 815, 320, 130), COL.red, 7);
  c.save(); c.beginPath(); star5(c, 815, 320, 130); c.clip(); c.fillStyle = "#f5c9c0"; c.fillRect(815, 150, 140, 360); c.restore();
  shape(c, () => star5(c, 815, 320, 130), NONE, 7);
  shape(c, () => rrect(c, 80, 700, 480, 130, 6), "#e8d28a", 6);
  for (let i = 0; i < 4; i++) line(c, [[110, 730 + i * 26], [530, 730 + i * 26]], 6, "#a89654");
  person(c, 800, 1040, 400, { armL: [Math.PI * 0.45, Math.PI * 0.2], armR: [Math.PI * 0.55, Math.PI * 0.75] });
  shape(c, () => rrect(c, 760, 800, 110, 140, 6), WHITE, 6); line(c, [[800, 830], [840, 830]], 5, COL.blue); line(c, [[800, 860], [840, 860]], 5, COL.blue);
};
// a4: the sunbeam's long trip: zigzag out of the cushions, then straight across the room to the Earth things
const flowA4 = (c: Ctx) => {
  ground(c);
  c.fillStyle = FLOOR; c.fillRect(0, 880, D, 200); line(c, [[0, 880], [D, 880]], 6);
  const cush = [[60, 770, 180, 110, COL.orange], [250, 770, 180, 110, COL.yellow], [150, 670, 180, 110, COL.yellow], [60, 570, 180, 110, COL.orange], [250, 650, 180, 110, COL.orange], [150, 560, 180, 110, COL.yellow]] as const;
  for (const [x, y, w, h, col] of cush) { shape(c, () => rrect(c, x, y, w, h, 40), col, 6); shine(c, [[x + 30, y + 28], [x + 80, y + 20]], 6); }
  const zz = [[190, 640], [300, 580], [170, 520], [330, 470], [250, 420], [440, 420]];
  line(c, zz, 12, INK); line(c, zz, 6, RED);
  arrow(c, [[460, 420], [740, 420]]);
  write(c, "8", 570, 300, 80, INK, 9);
  person(c, 590, 960, 380, { armL: [Math.PI * 0.55, Math.PI * 0.5], armR: [Math.PI * 0.4, Math.PI * 0.1] });
  // plant, dark cloth, white paper
  shadow(c, 860, 960, 110, 20);
  shape(c, () => polyP(c, [[800, 800], [920, 800], [900, 920], [820, 920]]), COL.orange, 6);
  leaf(c, 860, 800, 130, -2.3); leaf(c, 860, 800, 140, -0.8); leaf(c, 860, 800, 150, -1.55, COL.greenLt);
  shape(c, () => polyP(c, [[740, 940], [900, 930], [960, 1010], [720, 1020]]), "#3c3a52", 6);
  shape(c, () => polyP(c, [[940, 940], [1050, 940], [1040, 1030], [930, 1030]]), WHITE, 6);
};
// p1: the sun print: objects on coloured paper under glass; after days, the paper has faded except under them
const flowP1 = (c: Ctx) => {
  ground(c);
  sunBall(c, 540, 130, 80);
  const objs = (x: number, y: number, col: string) => {
    shape(c, () => star5(c, x + 100, y + 120, 70), col, 5);
    shape(c, () => ell(c, x + 250, y + 130, 50, 50), col, 5);
    shape(c, () => ell(c, x + 90, y + 330, 38, 38), col, 5); shape(c, () => rrect(c, x + 120, y + 318, 150, 26, 8), col, 5);
    shape(c, () => ell(c, x + 235, y + 250, 24, 60, 0.6), col, 5);
  };
  shape(c, () => rrect(c, 80, 400, 380, 480, 10), COL.red, 7); objs(90, 410, "#6c6a74");
  shape(c, () => rrect(c, 70, 390, 400, 500, 14), "rgba(214,236,250,0.35)", 6); shine(c, [[110, 430], [110, 700]], 10);
  beam(c, [[200, 250], [200, 380]]); beam(c, [[340, 250], [340, 380]]);
  shape(c, () => rrect(c, 620, 400, 380, 480, 10), "#f4cdc6", 7); objs(630, 410, COL.red);
  arrow(c, [[495, 640], [595, 640]]);
  write(c, "1", 230, 925, 80, INK, 9); write(c, "6", 760, 925, 80, INK, 9);
};
// c1: a box sun cooker (foil, black paper, clear cover) melts chocolate; the bowl in the open does not
const flowC1 = (c: Ctx) => {
  ground(c);
  sunBall(c, 540, 110, 75);
  shadow(c, 330, 950, 300, 24);
  shape(c, () => polyP(c, [[110, 560], [570, 560], [530, 920], [150, 920]]), COL.brown, 7);
  shape(c, () => polyP(c, [[135, 570], [545, 570], [512, 905], [168, 905]]), COL.steelIn, 4);
  shape(c, () => polyP(c, [[110, 560], [150, 560], [70, 340], [30, 355]]), COL.steel, 6);
  shape(c, () => polyP(c, [[530, 560], [570, 560], [610, 355], [570, 340]]), COL.steel, 6);
  shape(c, () => rrect(c, 230, 840, 200, 40, 6), DARK, 5);
  bowl(c, 330, 800, 95, CHOC);
  shape(c, () => polyP(c, [[112, 560], [568, 560], [568, 585], [112, 585]]), "rgba(214,236,250,0.7)", 5);
  beam(c, [[490, 170], [70, 340]], 7); beam(c, [[530, 190], [330, 540]], 7); beam(c, [[570, 180], [600, 340]], 7);
  beam(c, [[85, 345], [290, 700]], 7); beam(c, [[600, 350], [380, 700]], 7, true, "#fff3b0");
  shadow(c, 850, 940, 160, 24);
  bowl(c, 850, 880, 130, COL.steelIn);
  shape(c, () => rrect(c, 800, 850, 100, 60, 10), CHOC, 5); shine(c, [[815, 865], [850, 865]], 6);
  beam(c, [[610, 170], [780, 780]], 7);
};

// ================================================================ terms
// energy: wet clothes drying in the sun, wavy lines rising from the wet towel
const termEnergy = (c: Ctx) => {
  ground(c);
  sunBall(c, 900, 150, 85);
  c.fillStyle = FLOOR; c.fillRect(0, 900, D, 180); line(c, [[0, 900], [D, 900]], 6);
  for (const x of [80, 1000]) shape(c, () => rrect(c, x - 14, 300, 28, 600, 8), COL.brown, 6);
  line(c, [[80, 330], [1000, 360]], 8);
  shape(c, () => polyP(c, [[200, 350], [500, 354], [500, 700], [200, 690]]), COL.blue, 6);
  for (const [x, y] of [[250, 760], [330, 800], [430, 770]]) shape(c, () => polyP(c, [[x, y - 24], [x - 14, y + 4], [x + 14, y + 4]]), COL.drop, 4);
  for (const x of [270, 350, 430]) heat(c, x, 320, 190, 7, 12);
  shape(c, () => polyP(c, [[600, 360], [650, 330], [760, 345], [810, 330], [860, 370], [830, 420], [790, 410], [790, 640], [660, 640], [660, 410], [620, 425], [580, 400]]), COL.yellow, 6);
};
// absorb: sunlight goes into a black umbrella and stops, heat rises
const termAbsorb = (c: Ctx) => {
  ground(c);
  sunBall(c, 170, 150, 85);
  line(c, [[600, 520], [600, 900]], 26, INK); line(c, [[600, 520], [600, 900]], 14, COL.brown);
  shape(c, () => { c.moveTo(280, 560); c.quadraticCurveTo(300, 280, 600, 270); c.quadraticCurveTo(900, 280, 920, 560); c.quadraticCurveTo(840, 510, 760, 560); c.quadraticCurveTo(680, 510, 600, 560); c.quadraticCurveTo(520, 510, 440, 560); c.quadraticCurveTo(360, 510, 280, 560); c.closePath(); }, DARK, 7);
  for (const x of [440, 600, 760]) line(c, [[600, 275], [x, 545]], 4, "#59546a");
  shape(c, () => ell(c, 600, 262, 14, 14), "#59546a", 5);
  beam(c, [[250, 270], [440, 380]], 9); beam(c, [[290, 190], [540, 310]], 9);
  beam(c, [[380, 120], [650, 275]], 9);
  heat(c, 760, 250, 150, 8); heat(c, 860, 290, 130, 8);
};
// reflect: sunlight bounces off a white wall
const termReflect = (c: Ctx) => {
  ground(c);
  sunBall(c, 170, 150, 85);
  shadow(c, 800, 1020, 260, 24);
  shape(c, () => rrect(c, 640, 400, 340, 620, 8), WHITE, 7);
  for (let r = 0; r < 4; r++) for (let k = 0; k < 2; k++) line(c, [[640 + k * 170 + (r % 2) * 85, 400 + r * 150], [640 + k * 170 + (r % 2) * 85, 400 + r * 150 + 150]], 3, "#cfc8bc");
  for (let r = 1; r < 4; r++) line(c, [[640, 400 + r * 150], [980, 400 + r * 150]], 3, "#cfc8bc");
  shade(c, () => rrect(c, 640, 400, 340, 620, 8), "#cfc8bc", 40, 0, 0.5);
  shape(c, () => rrect(c, 640, 400, 340, 620, 8), NONE, 7);
  for (const [sy, ey, ry] of [[210, 430, 700], [250, 520, 800], [180, 360, 620]] as const) {
    beam(c, [[290, sy - 40], [640, ey]], 9); beam(c, [[640, ey], [330, ry + 160]], 9, true, "#fff3b0");
  }
};
// heat: bare feet on sunny floor tiles, heat rising into the soles
const termHeat = (c: Ctx) => {
  ground(c);
  sunBall(c, 170, 150, 85);
  shape(c, () => polyP(c, [[0, 760], [1080, 760], [1080, 1080], [0, 1080]]), "#f3e3b8", 6);
  for (let i = 1; i < 4; i++) line(c, [[0, 760 + i * 80], [1080, 760 + i * 80]], 4);
  for (let i = 1; i < 8; i++) line(c, [[i * 150 - 120, 760], [i * 160 - 260, 1080]], 4);
  const foot = (x: number) => {
    shadow(c, x + 20, 790, 190, 24);
    shape(c, () => rrect(c, x - 28, 480, 56, 230, 18), SKIN.child, 6);
    shape(c, () => { c.moveTo(x - 70, 700); c.quadraticCurveTo(x - 80, 790, x - 30, 800); c.lineTo(x + 175, 800); c.quadraticCurveTo(x + 220, 800, x + 215, 750); c.quadraticCurveTo(x + 180, 700, x + 60, 690); c.quadraticCurveTo(x + 10, 640, x - 40, 640); c.closePath(); }, SKIN.child, 6);
    for (let k = 0; k < 4; k++) shape(c, () => ell(c, x + 205 - k * 2, 790 - k * 17, 14, 11), SKIN.child, 4);
  };
  foot(430); foot(660);
  for (const x of [380, 470, 610, 700, 790]) arrow(c, [[x, 905], [x, 815]], RED, 9);
};
// focus: lens low = big circle, higher = smaller, highest = tiny dot
const termFocus = (c: Ctx) => {
  ground(c);
  const F = 400, py = 900;
  [[180, 790], [540, 620], [900, 500]].forEach(([cx, ly]) => {
    const hw = 140, d = py - ly, w = hw * (1 - d / F);
    c.fillStyle = "rgba(255,224,102,0.55)"; c.beginPath(); polyP(c, [[cx - hw, ly], [cx + hw, ly], [cx + w, py], [cx - w, py]]); c.fill();
    line(c, [[cx - hw, ly], [cx - w, py]], 5); line(c, [[cx + hw, ly], [cx + w, py]], 5);
    line(c, [[cx - hw, ly - 160], [cx - hw, ly]], 8, BEAM); line(c, [[cx + hw, ly - 160], [cx + hw, ly]], 8, BEAM);
    shape(c, () => ell(c, cx, ly, hw + 12, 20), COL.steel, 6); shape(c, () => ell(c, cx, ly, hw - 6, 12), "rgba(214,236,250,0.8)", 4);
    shape(c, () => rrect(c, cx - 150, py, 300, 40, 8), DARK, 6);
    line(c, [[cx - Math.max(w, 7), py - 4], [cx + Math.max(w, 7), py - 4]], 14, "#fffbe3");
  });
  arrow(c, [[300, 560], [420, 560]], RED, 9); arrow(c, [[660, 480], [780, 480]], RED, 9);
};
// core: the Sun cut open like an orange, a small white-hot ball at the centre
const termCore = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 960, 380, 40);
  shape(c, () => ell(c, 540, 540, 400, 400), "#f58a2e", 7);
  shape(c, () => ell(c, 540, 540, 310, 310), "#f9ac32", 6);
  shape(c, () => ell(c, 540, 540, 220, 220), "#ffcf4a", 6);
  shape(c, () => ell(c, 540, 540, 120, 120), "#fff8d8", 7);
  shine(c, [[470, 500], [500, 465]], 10);
  for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4 + 0.3; line(c, [[540 + Math.cos(a) * 135, 540 + Math.sin(a) * 135], [540 + Math.cos(a) * 190, 540 + Math.sin(a) * 190]], 10, "#fff8d8"); }
};
// hydrogen and helium: a balloon seller's helium balloons, and the Sun made of the same gases
const termHH = (c: Ctx) => {
  ground(c);
  c.fillStyle = FLOOR; c.fillRect(0, 930, D, 150); line(c, [[0, 930], [D, 930]], 6);
  const bal = (x: number, y: number, col: string, dk: string) => {
    line(c, [[x, y + 100], [250, 560]], 4);
    const b = () => { c.moveTo(x, y + 100); c.bezierCurveTo(x - 105, y + 70, x - 115, y - 100, x, y - 100); c.bezierCurveTo(x + 115, y - 100, x + 105, y + 70, x, y + 100); c.closePath(); };
    shape(c, b, col); shade(c, b, dk, 25, 8); shape(c, b, NONE, 6); shine(c, [[x - 45, y - 40], [x - 28, y - 70]], 9);
  };
  bal(110, 250, COL.red, "#b83a2a"); bal(250, 160, COL.yellow, SUNDK); bal(390, 270, COL.teal, COL.tealDk); bal(190, 380, COL.pink, "#d9708e");
  person(c, 250, 960, 460, { adult: true, armL: [Math.PI * 0.4, Math.PI * 0.4], armR: [Math.PI * 0.45, Math.PI * 0.1] });
  sunBall(c, 770, 500, 210, true);
  const r = rnd(5);
  for (let i = 0; i < 14; i++) { const a = r() * 6.28, d = r() * 150; shape(c, () => ell(c, 770 + Math.cos(a) * d, 500 + Math.sin(a) * d, 17, 17), i % 3 ? "#9ccbef" : WHITE, 4); }
};
// nuclear fusion: four hydrogen dots squeezed into one bigger helium dot with a flash
const fusion = (c: Ctx, hot: boolean) => {
  if (hot) { ground(c, "#f6a33a"); const r = rnd(9); for (let i = 0; i < 18; i++) { const a = (i * Math.PI * 2) / 18; line(c, [[800 + Math.cos(a) * 190, 540 + Math.sin(a) * 190], [800 + Math.cos(a) * 400, 540 + Math.sin(a) * 400]], 12, "#ffe066"); void r; } } else ground(c);
  const bx = 780;
  for (const [x, y] of [[130, 400], [290, 400], [130, 570], [290, 570]]) { shape(c, () => ell(c, x, y, 70, 70), "#9ccbef", 7); shine(c, [[x - 30, y - 10], [x - 12, y - 35]], 9); }
  arrow(c, [[420, 485], [510, 485]], RED, 14);
  const burst: number[][] = []; for (let i = 0; i < 20; i++) { const a = (i * Math.PI) / 10, rr = i % 2 ? 150 : 235; burst.push([bx + Math.cos(a) * rr, 485 + Math.sin(a) * rr]); }
  shape(c, () => polyP(c, burst), hot ? "#fff3b0" : COL.yellow, 7);
  shape(c, () => ell(c, bx, 485, 100, 100), COL.pink, 8); shine(c, [[bx - 55, 470], [bx - 30, 440]], 11);
};
// retina: light enters the eye, is gathered by the lens and meets on the pink back layer
const eye = (c: Ctx, sun = true) => {
  if (sun) sunBall(c, 90, 540, 55, false);
  shape(c, () => ell(c, 335, 540, 60, 125), "rgba(214,236,250,0.8)", 6);
  shape(c, () => ell(c, 610, 540, 280, 280), WHITE, 7);
  line(c, (() => { const p: number[][] = []; for (let i = 0; i <= 30; i++) { const a = -1 + (i / 30) * 2; p.push([610 + Math.cos(a) * 262, 540 + Math.sin(a) * 262]); } return p; })(), 40, INK);
  line(c, (() => { const p: number[][] = []; for (let i = 0; i <= 30; i++) { const a = -1 + (i / 30) * 2; p.push([610 + Math.cos(a) * 262, 540 + Math.sin(a) * 262]); } return p; })(), 26, "#f08fa3");
  shape(c, () => rrect(c, 366, 340, 44, 125, 14), COL.brown, 5); shape(c, () => rrect(c, 366, 615, 44, 125, 14), COL.brown, 5);
  shape(c, () => ell(c, 440, 540, 32, 95), "rgba(214,236,250,0.9)", 5); shine(c, [[430, 490], [430, 530]], 7);
  for (const y of [470, 540, 610]) { beam(c, [[165, y], [415, y]], 7, false); beam(c, [[415, y], [868, 540]], 7, false); }
  shape(c, () => ell(c, 868, 540, 22, 22), "#fffbe3", 6);
};
const termRetina = (c: Ctx) => { ground(c); eye(c); };
// ultraviolet: a curtain faded where the sunlight falls
const termUV = (c: Ctx) => {
  ground(c);
  c.fillStyle = WALL; c.fillRect(0, 0, D, 1080);
  shape(c, () => rrect(c, 330, 140, 420, 700, 8), COL.wood, 8); shape(c, () => rrect(c, 360, 170, 360, 640, 4), COL.sky, 5);
  sunBall(c, 540, 55, 42, false);
  for (const x of [440, 540, 640]) beam(c, [[540, 100], [x, 400]], 8);
  for (const [x0, x1] of [[60, 320], [760, 1020]]) {
    const cur = () => rrect(c, x0, 100, x1 - x0, 800, 12);
    shape(c, cur, "#8b6cc9", 7);
    c.save(); c.beginPath(); cur(); c.clip(); c.fillStyle = "#d9cdf0"; if (x0 < 330) c.fillRect(x1 - 90, 100, 90, 800); else c.fillRect(x0, 100, 90, 800); c.restore();
    for (let k = 1; k < 4; k++) { const x = x0 + ((x1 - x0) * k) / 4; line(c, [[x, 120], [x, 880]], 4, "#6a4fa8"); }
    shape(c, cur, NONE, 7);
  }
};
// infrared: a child with closed eyes feels warmth on one cheek, faint red lines from the Sun
const termIR = (c: Ctx) => {
  ground(c);
  sunBall(c, 130, 250, 85);
  const head = () => ell(c, 640, 560, 270, 290);
  shape(c, () => rrect(c, 520, 800, 250, 200, 40), SKIN.child, 6);
  shape(c, () => rrect(c, 380, 880, 520, 260, 60), CLOTH.child, 6);
  shape(c, head, SKIN.child, 7);
  c.save(); c.beginPath(); head(); c.clip(); c.beginPath(); ell(c, 640, 330, 300, 190); c.fillStyle = CLOTH.hair; c.fill(); c.restore();
  c.beginPath(); head(); c.lineWidth = 7; c.strokeStyle = INK; c.stroke();
  shape(c, () => ell(c, 450, 640, 62, 40), "#e0805f", 0);
  for (const x of [540, 740]) { c.beginPath(); c.arc(x, 560, 48, 0.25, Math.PI - 0.25); c.lineWidth = 9; c.strokeStyle = INK; c.lineCap = "round"; c.stroke(); }
  c.beginPath(); c.arc(640, 670, 62, 0.3, Math.PI - 0.3); c.lineWidth = 9; c.stroke();
  for (const y of [580, 640, 700]) { const p: number[][] = []; for (let i = 0; i <= 30; i++) p.push([250 + i * 6.4, y - (y - 330) * (1 - i / 30) * 0.6 + Math.sin(i * 0.7) * 13]); line(c, p, 7, RED); }
};
// eclipse glasses: very dark lenses in card, against ordinary sunglasses with a red cross
const termGlasses = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 130, 130, 820, 330, 40), "#d8b883", 8);
  shape(c, () => rrect(c, 200, 190, 300, 200, 30), "#15121c", 7); shape(c, () => rrect(c, 580, 190, 300, 200, 30), "#15121c", 7);
  shine(c, [[240, 225], [300, 225]], 8); shine(c, [[620, 225], [680, 225]], 8);
  tick(c, 540, 100, 36);
  line(c, [[225, 770], [855, 770]], 14); 
  shape(c, () => rrect(c, 160, 660, 340, 220, 90), "#4a4f6a", 8); shape(c, () => rrect(c, 580, 660, 340, 220, 90), "#4a4f6a", 8);
  line(c, [[500, 730], [580, 730]], 12); line(c, [[160, 720], [90, 690]], 12); line(c, [[920, 720], [990, 690]], 12);
  shine(c, [[200, 710], [250, 690]], 9); shine(c, [[620, 710], [670, 690]], 9);
  line(c, [[120, 600], [960, 960]], 30, RED); line(c, [[960, 600], [120, 960]], 30, RED);
};
// solar panel: blue panels on a flat apartment roof in sunshine
const termPanel = (c: Ctx) => {
  ground(c);
  sunBall(c, 900, 130, 80);
  shadow(c, 540, 1040, 450, 30);
  shape(c, () => rrect(c, 150, 600, 780, 430, 6), "#e9d9bd", 7);
  for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) shape(c, () => rrect(c, 200 + k * 190, 680 + r * 110, 100, 70, 6), COL.sky, 5);
  shape(c, () => rrect(c, 110, 560, 860, 56, 6), COL.steel, 7);
  for (const x of [170, 450]) {
    shape(c, () => polyP(c, [[x, 560], [x + 280, 560], [x + 330, 390], [x + 50, 390]]), COL.blueDk, 7);
    for (let i = 1; i < 4; i++) line(c, [[x + i * 70 + 0, 560 - 0], [x + 50 + i * 70, 390]], 3, "#8fb0e0");
    for (let i = 1; i < 3; i++) line(c, [[x + 50 * (1 - i / 3) * 0 + (i * 50) / 3, 560 - (i * 170) / 3], [x + 280 + (i * 50) / 3, 560 - (i * 170) / 3]], 3, "#8fb0e0");
    line(c, [[x + 140, 560], [x + 190, 440]], 8);
  }
  shape(c, () => rrect(c, 780, 430, 130, 130, 10), DARK, 6);
  beam(c, [[820, 190], [640, 400]], 9); beam(c, [[760, 130], [520, 395]], 9);
};

// ================================================================ explanations
// expl0: a tiny Earth beside the curved edge of the Sun that fills the page
const explSize = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 1480, 760, 1050, 1050), "#f5a830", 7);
  shape(c, () => ell(c, 1480, 760, 960, 960), SUN, 0);
  shade(c, () => ell(c, 1480, 760, 1050, 1050), SUNDK, 40, 40, 0.0);
  shape(c, () => ell(c, 1480, 760, 1050, 1050), NONE, 7);
  earth(c, 250, 540, 26);
  arrow(c, [[250, 360], [250, 480]], RED, 10);
  write(c, "109", 190, 190, 110, INK, 12);
};
// expl2: a slow zigzag inside the Sun, then one straight dash across space to Earth in 8 minutes
const explTime = (c: Ctx) => {
  ground(c);
  shape(c, () => ell(c, 200, 540, 330, 330), "#f5a830", 7);
  const zz: number[][] = [[200, 540]];
  for (let i = 1; i <= 9; i++) { const t = i / 9; zz.push([200 + t * 233 + (i % 2 ? 38 : -38), 540 - t * 233 + (i % 2 ? 38 : -38)]); }
  zz[9] = [433, 307];
  line(c, zz, 13, INK); line(c, zz, 7, RED);
  shape(c, () => ell(c, 200, 540, 40, 40), "#fff8d8", 6);
  arrow(c, [[433, 307], [830, 307]], "#ffb400", 16);
  earth(c, 930, 307, 70);
  shape(c, () => ell(c, 700, 700, 150, 150), WHITE, 8);
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[700 + Math.cos(a) * 125, 700 + Math.sin(a) * 125], [700 + Math.cos(a) * 138, 700 + Math.sin(a) * 138]], 5); }
  line(c, [[700, 700], [700, 600]], 9); line(c, [[700, 700], [790, 750]], 9, RED);
  write(c, "8", 880, 660, 120, INK, 12);
};
// expl3: black road takes the light in and warms; white wall sends it back
const explAbsorbReflect = (c: Ctx) => {
  ground(c);
  sunBall(c, 400, 130, 80);
  shape(c, () => polyP(c, [[30, 800], [520, 800], [560, 920], [0, 920]]), DARK, 7);
  line(c, [[100, 860], [160, 860]], 8, "#eadfb0"); line(c, [[260, 860], [320, 860]], 8, "#eadfb0"); line(c, [[420, 860], [480, 860]], 8, "#eadfb0");
  shadow(c, 800, 980, 230, 24);
  shape(c, () => polyP(c, [[600, 600], [1000, 600], [1040, 700], [640, 700]]), WHITE, 7);
  shape(c, () => rrect(c, 640, 700, 400, 270, 6), "#e8e1d4", 7);
  for (const x of [190, 340]) { beam(c, [[400, 215], [x, 790]], 9); }
  for (const x of [190, 340]) heat(c, x + 5, 770, 160, 8);
  beam(c, [[420, 215], [760, 592]], 9); beam(c, [[760, 592], [1000, 400]], 9, true, "#fff3b0");
  beam(c, [[500, 200], [880, 592]], 9); beam(c, [[880, 592], [1040, 430]], 9, true, "#fff3b0");
};
// expl4: a lens gathers sunlight into a dot, and the paper smokes
const explLens = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 960, 400, 40);
  shape(c, () => polyP(c, [[130, 880], [950, 880], [1010, 960], [70, 960]]), DARK, 7);
  lensBeams(c, 480, 400, 260, 120, 480, 872);
  magnifier(c, 480, 400, 280, 40, 230);
  shape(c, () => ell(c, 480, 872, 26, 12), "#fffbe3", 4);
  smoke(c, 540, 860, 200);
};
// expl6: sunlight through a prism; thermometers in each colour; the one past the red is hottest
const explSpectrum = (c: Ctx) => {
  ground(c);
  c.fillStyle = FLOOR; c.fillRect(0, 880, D, 200); line(c, [[0, 880], [D, 880]], 6);
  const cols = ["#8b6cc9", "#4a6fd1", "#4cae6a", "#ffd34d", "#f39a3c", "#e4523b"];
  shape(c, () => polyP(c, [[240, 100], [400, 100], [320, 270]]), "rgba(214,236,250,0.8)", 7);
  beam(c, [[40, 40], [260, 160]], 12, false, WHITE);
  cols.forEach((col, i) => { const x0 = 220 + i * 95; c.fillStyle = col; c.beginPath(); polyP(c, [[360, 165 + i * 8], [x0 + 70, 830], [x0 + 150, 830], [370, 175 + i * 8 + 10]]); c.globalAlpha = 0.6; c.fill(); c.globalAlpha = 1; });
  cols.forEach((col, i) => { shape(c, () => rrect(c, 250 + i * 95, 830, 95, 50, 4), col, 5); });
  const therm = (x: number, lvl: number) => {
    shape(c, () => rrect(c, x - 18, 560, 36, 280, 18), WHITE, 6);
    shape(c, () => ell(c, x, 835, 30, 30), RED, 6);
    c.fillStyle = RED; c.fillRect(x - 7, 835 - lvl, 14, lvl);
  };
  [0, 1, 2, 3, 4, 5].forEach((i) => { if (i % 2 === 0) therm(297 + i * 95, 120 + i * 18); });
  therm(870, 255);
};
// expl8: the Sun's colour from space, at noon and at sunset
const explColour = (c: Ctx) => {
  ground(c);
  const panel = (x: number, sky: string) => { shape(c, () => rrect(c, x, 130, 320, 820, 22), sky, 7); };
  panel(30, "#14111f"); panel(380, "#7fc1ec"); panel(730, "#f08a4b");
  const r = rnd(3);
  for (let i = 0; i < 22; i++) { shape(c, () => ell(c, 50 + r() * 280, 150 + r() * 780, 3 + r() * 3, 3 + r() * 3), WHITE, 0); }
  shape(c, () => ell(c, 190, 450, 85, 85), WHITE, 6);
  shape(c, () => ell(c, 540, 330, 85, 85), "#fff1a8", 6);
  c.save(); c.beginPath(); rrect(c, 730, 130, 320, 820, 22); c.clip();
  c.fillStyle = "#f5b46a"; c.fillRect(730, 560, 320, 100); c.fillStyle = "#3f6fb3"; c.fillRect(730, 660, 320, 300);
  c.restore();
  shape(c, () => ell(c, 890, 560, 85, 85), "#f15a22", 6);
  c.save(); c.beginPath(); rrect(c, 730, 130, 320, 820, 22); c.clip(); c.fillStyle = "#3f6fb3"; c.fillRect(730, 640, 320, 320); line(c, [[730, 640], [1050, 640]], 5); c.fillStyle = "#f9c27a"; c.fillRect(850, 650, 80, 10); c.fillRect(830, 685, 120, 10); c.restore();
  for (const x of [30, 380, 730]) shape(c, () => rrect(c, x, 130, 320, 820, 22), NONE, 7);
};

export const ic_skyTheSunL3 = cards("sci.sky.the-sun.L3 cards", [
  flowE1, flowE2, flowA1, flowA2, flowA3, flowA4, flowP1, flowC1,
  termEnergy, termAbsorb, termReflect, termHeat, termFocus, termCore, termHH, (c) => fusion(c, false), termRetina, termUV, termIR, termGlasses, termPanel,
  explSize, (c) => fusion(c, true), explTime, explAbsorbReflect, explLens, (c) => { ground(c); c.save(); c.translate(40, -130); c.scale(0.85, 0.85); eye(c, true); c.restore(); c.save(); c.translate(190, 540); c.scale(0.5, 0.5); lensOnly(c); c.restore(); }, explSpectrum, explColour,
]);
function lensOnly(c: Ctx) {
  shape(c, () => polyP(c, [[130, 880], [950, 880], [1010, 960], [70, 960]]), DARK, 7);
  lensBeams(c, 480, 400, 260, 120, 480, 872);
  magnifier(c, 480, 400, 280, 40, 230);
  shape(c, () => ell(c, 480, 872, 26, 12), "#fffbe3", 4);
}
