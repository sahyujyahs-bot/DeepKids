import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, person, hand, write, cards } from "./flatKit";

const YEL = "#ffd34d", ORG = "#e08a1e";
const norm = (x: number, y: number) => { const l = Math.hypot(x, y); return [x / l, y / l]; };
// a light ray along points, with a red arrow head on the last stretch
const ray = (c: Ctx, pts: number[][], head = true) => {
  line(c, pts, 17, ORG); line(c, pts, 9, YEL);
  if (head) { const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]], [ux, uy] = norm(b[0] - a[0], b[1] - a[1]); arrow(c, [[b[0] - ux * 50, b[1] - uy * 50], b], RED, 9); }
};
const dashed = (c: Ctx, a: number[], b: number[], col = INK, w = 5) => { const n = 14; for (let i = 0; i < n; i++) if (i % 2 === 0) line(c, [[a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n], [a[0] + (b[0] - a[0]) * (i + 1) / n, a[1] + (b[1] - a[1]) * (i + 1) / n]], w, col); };
// a small flat mirror: a thick steel bar from p to q, shiny front
const mirrorBar = (c: Ctx, x1: number, y1: number, x2: number, y2: number, th = 26) => {
  const [ux, uy] = norm(x2 - x1, y2 - y1), nx = -uy * th, ny = ux * th;
  shape(c, () => polyP(c, [[x1, y1], [x2, y2], [x2 + nx, y2 + ny], [x1 + nx, y1 + ny]]), COL.steelDk, 6);
  shape(c, () => polyP(c, [[x1, y1], [x2, y2], [x2 + nx * 0.4, y2 + ny * 0.4], [x1 + nx * 0.4, y1 + ny * 0.4]]), COL.steelIn, 4);
};
const toy = (c: Ctx, x: number, y: number, s = 1, a = 1) => {
  c.save(); c.globalAlpha = a; c.translate(x, y); c.scale(s, s);
  shape(c, () => rrect(c, -40, -40, 80, 80, 20), COL.red, 6);
  shape(c, () => ell(c, 0, -10, 24, 24), COL.paper, 4);
  shape(c, () => ell(c, -8, -14, 5, 6), INK, 0); shape(c, () => ell(c, 8, -14, 5, 6), INK, 0);
  c.restore();
};
const torch = (c: Ctx, x: number, y: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, -190, -34, 150, 68, 16), COL.blue, 6);
  shape(c, () => polyP(c, [[-45, -34], [0, -56], [0, 56], [-45, 34]]), COL.steel, 6);
  shape(c, () => ell(c, 0, 0, 10, 50), YEL, 5);
  c.restore();
};
const face = (c: Ctx, x: number, y: number, r: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => ell(c, 0, 0, r, r), SKIN.child, Math.max(3, r * 0.06));
  shape(c, () => { c.moveTo(-r, 0); c.bezierCurveTo(-r, -r * 1.5, r, -r * 1.5, r, 0); c.quadraticCurveTo(0, -r * 0.55, -r, 0); c.closePath(); }, CLOTH.hair, Math.max(3, r * 0.05));
  shape(c, () => ell(c, -r * 0.35, r * 0.12, r * 0.09, r * 0.12), INK, 0); shape(c, () => ell(c, r * 0.35, r * 0.12, r * 0.09, r * 0.12), INK, 0);
  c.beginPath(); c.arc(0, r * 0.38, r * 0.3, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = Math.max(3, r * 0.05); c.stroke();
  c.restore();
};
const sunDisc = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; line(c, [[x + Math.cos(a) * (r + 14), y + Math.sin(a) * (r + 14)], [x + Math.cos(a) * (r + 46), y + Math.sin(a) * (r + 46)]], 10, ORG); }
  shape(c, () => ell(c, x, y, r, r), YEL, 6);
};

// 0 summary: a child and the image in a mirror
const summary = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 520, 110, 490, 770, 28), COL.wood, 7);
  shape(c, () => rrect(c, 552, 142, 426, 706, 14), COL.sky, 5);
  c.save(); c.beginPath(); rrect(c, 552, 142, 426, 706, 14); c.clip();
  person(c, 765, 840, 600, { armR: [-0.9, -1.4] }); c.restore();
  shine(c, [[590, 190], [700, 190]], 10); shine(c, [[590, 190], [590, 300]], 10);
  shadow(c, 270, 905, 160, 24);
  person(c, 270, 900, 600, { armL: [Math.PI + 0.9, Math.PI + 1.4] });
  arrow(c, [[400, 960], [520, 960]]);
};

// 1 e1: torch beam hits a mirror, bounces at the same angle
const e1 = (c: Ctx) => {
  ground(c);
  const P = [540, 760], S = [200, 280], T = [880, 280];
  mirrorBar(c, 130, 760, 950, 760, 40);
  dashed(c, P, [540, 200], INK, 6);
  ray(c, [S, P], true); ray(c, [P, T], true);
  torch(c, S[0] - 24, S[1] - 37, Math.atan2(P[1] - S[1], P[0] - S[0]));
  const a1 = Math.atan2(S[1] - P[1], S[0] - P[0]), a2 = Math.atan2(T[1] - P[1], T[0] - P[0]);
  c.beginPath(); c.arc(P[0], P[1], 150, a1, -Math.PI / 2); c.strokeStyle = COL.blueDk; c.lineWidth = 9; c.stroke();
  c.beginPath(); c.arc(P[0], P[1], 150, -Math.PI / 2, a2); c.strokeStyle = COL.blueDk; c.lineWidth = 9; c.stroke();
  shape(c, () => ell(c, T[0], T[1], 34, 34), WHITE, 5);
};

// 2 e2: drawing a star while looking only in the mirror
const star = (cx: number, cy: number, R: number, r: number, rot: number) => { const p: number[][] = []; for (let i = 0; i < 10; i++) { const a = rot + i * Math.PI / 5, rr = i % 2 ? r : R; p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } return p; };
const e2 = (c: Ctx) => {
  ground(c);
  shape(c, () => polyP(c, [[60, 940], [1020, 940], [1020, 1010], [60, 1010]]), COL.wood, 6);
  shape(c, () => rrect(c, 180, 90, 720, 400, 24), COL.wood, 7);
  shape(c, () => rrect(c, 208, 118, 664, 344, 12), COL.sky, 5);
  shape(c, () => polyP(c, star(540, 290, 130, 55, Math.PI / 2)), WHITE, 6);
  shine(c, [[245, 150], [330, 150]], 9);
  shape(c, () => polyP(c, [[180, 900], [900, 900], [1000, 940], [80, 940]]), COL.wood, 0);
  shape(c, () => polyP(c, [[250, 620], [830, 620], [900, 900], [180, 900]]), COL.paper, 6);
  shape(c, () => polyP(c, star(540, 765, 130, 55, -Math.PI / 2)), "rgba(255,255,255,0)", 6);
  line(c, [[640, 800], [770, 700]], 22, COL.woodDk); line(c, [[640, 800], [770, 700]], 12, COL.yellow);
  hand(c, 870, 640, Math.atan2(150, -150) + 0.0, 1.0);
  arrow(c, [[300, 560], [300, 520]]);
};

// 3 e3: two mirrors like an open book, a toy between, images
const e3 = (c: Ctx) => {
  ground(c);
  c.translate(540, 600); c.scale(1.25, 1.25); c.translate(-540, -640);
  const H = [540, 700];
  mirrorBar(c, H[0], H[1], 255, 415, 30); mirrorBar(c, H[0], H[1], 825, 415, -30);
  toy(c, 540, 500, 0.9); toy(c, 340, 700, 0.9, 0.55); toy(c, 740, 700, 0.9, 0.55); toy(c, 540, 900, 0.9, 0.55);
  dashed(c, [540, 540], [540, 650], RED, 5);
};

// 4 a1: the spoon: inside (upside-down face) and back (small face)
const spoon = (c: Ctx, x: number) => {
  shadow(c, x + 40, 1010, 90, 20);
  shape(c, () => polyP(c, [[x - 22, 560], [x + 22, 560], [x + 34, 1000], [x - 34, 1000]]), COL.steel, 6);
  shape(c, () => ell(c, x, 380, 150, 205), COL.steel, 7);
};
const a1 = (c: Ctx) => {
  ground(c);
  spoon(c, 270); spoon(c, 810);
  shape(c, () => ell(c, 270, 380, 122, 175), COL.steelIn, 5);
  c.save(); c.beginPath(); ell(c, 270, 380, 122, 175); c.clip(); face(c, 270, 380, 105, Math.PI); c.restore();
  shade(c, () => ell(c, 810, 380, 150, 205), COL.steelDk, 40, 20);
  shine(c, [[720, 250], [700, 380]], 12);
  face(c, 810, 400, 40, 0);
  arrow(c, [[400, 120], [540, 60], [680, 120]]);
};

// 5 a2: mirror twins
const a2 = (c: Ctx) => {
  ground(c);
  for (let y = 120; y < 1000; y += 80) line(c, [[540, y], [540, y + 40]], 7, COL.blueDk);
  shadow(c, 300, 905, 150, 22); shadow(c, 780, 905, 150, 22);
  person(c, 300, 900, 640, { armR: [-0.6, -1.4] });
  person(c, 780, 900, 640, { armL: [Math.PI + 0.6, Math.PI + 1.4] });
};

// 6 a5: sunlight postman
const a5 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 820, 60, 300, 640, 0), "#e7d7bd", 6);
  [150, 100, 55].forEach((r, i) => shape(c, () => ell(c, 930, 330, r, r), i % 2 ? WHITE : RED, 5));
  shape(c, () => ell(c, 930, 330, 18, 18), RED, 4);
  const S = [150, 150], M = [450, 700], T = [905, 330];
  const i1 = norm(M[0] - S[0], M[1] - S[1]), o1 = norm(T[0] - M[0], T[1] - M[1]), nm = norm(o1[0] - i1[0], o1[1] - i1[1]), tx = -nm[1], ty = nm[0];
  shape(c, () => rrect(c, 400, 770, 100, 190, 8), COL.wood, 6);
  shadow(c, 450, 965, 120, 18);
  sunDisc(c, 130, 130, 62);
  ray(c, [[S[0] + 60, S[1] + 60], M], false); ray(c, [M, T], true);
  mirrorBar(c, M[0] - tx * 85, M[1] - ty * 85 - 0, M[0] + tx * 85, M[1] + ty * 85, 22);
  shape(c, () => ell(c, 450, 905, 0, 0), WHITE, 0);
};

// 7 a7: the endless corridor
const a7 = (c: Ctx) => {
  ground(c);
  for (let i = 0; i < 7; i++) {
    const s = Math.pow(0.7, i), w = 900 * s, h = 900 * s, cx = 540 + (1 - s) * 40, cy = 540 + (1 - s) * 30;
    shape(c, () => rrect(c, cx - w / 2, cy - h / 2, w, h, 20 * s), i % 2 ? COL.sky : COL.steelIn, Math.max(3, 8 * s));
    toy(c, cx, cy + h * 0.25, 2.1 * s);
  }
};

// 8 a9: act out a bounce
const a9 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 880, 80, 130, 920, 0), "#e7d7bd", 6);
  for (let y = 120; y < 1000; y += 100) line(c, [[880, y], [1010, y]], 4, COL.grey);
  for (let x = 880; x > 120; x -= 70) line(c, [[x, 540], [x - 35, 540]], 8, COL.blueDk);
  const P = [880, 540];
  line(c, [[260, 940], P, [260, 140]], 12, COL.brown);
  arrow(c, [[500, 740], [590, 700]]); arrow(c, [[590, 380], [500, 340]]);
  shape(c, () => ell(c, 220, 975, 55, 55), COL.red, 6);
  c.save(); c.globalAlpha = 0.5; shape(c, () => ell(c, 220, 105, 55, 55), COL.red, 6); c.restore();
  shape(c, () => ell(c, 840, 540, 40, 40), COL.red, 6);
};

// 9 p1: kaleidoscope pattern
const p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 940, 400, 30);
  shape(c, () => ell(c, 540, 520, 420, 420), COL.teal, 8);
  shape(c, () => ell(c, 540, 520, 350, 350), COL.tealDk, 6);
  c.save(); c.beginPath(); ell(c, 540, 520, 320, 320); c.clip(); c.fillStyle = "#2a2540"; c.fillRect(0, 0, D, D);
  const beads: [number, number, number, string][] = [[90, 8, 34, COL.yellow], [170, 18, 40, COL.pink], [250, 10, 30, COL.blue], [240, 24, 26, COL.green], [130, 22, 22, COL.orange], [300, 20, 22, COL.purple], [200, 4, 24, COL.red]];
  for (let k = 0; k < 12; k++) {
    c.save(); c.translate(540, 520); c.rotate(k * Math.PI / 6); if (k % 2) c.scale(1, -1);
    c.beginPath(); c.moveTo(0, 0); c.lineTo(340, 0); c.lineTo(340 * Math.cos(Math.PI / 6), 340 * Math.sin(Math.PI / 6)); c.closePath(); c.clip();
    for (const [r, th, rad, col] of beads) { const a = th * Math.PI / 180; shape(c, () => ell(c, Math.cos(a) * r, Math.sin(a) * r, rad, rad * 0.8, a), col, 4); }
    c.restore();
  }
  c.restore();
  c.beginPath(); ell(c, 540, 520, 320, 320); c.strokeStyle = INK; c.lineWidth = 7; c.stroke();
};

// 10 c1: light the hidden toy
const c1 = (c: Ctx) => {
  ground(c);
  const T = [120, 280], M1 = [760, 280], M2 = [760, 800], Toy = [330, 800];
  shape(c, () => rrect(c, 130, 440, 230, 280, 10), COL.brown, 7);
  shape(c, () => polyP(c, [[130, 440], [360, 440], [360, 480], [130, 480]]), COL.woodDk, 4);
  ray(c, [[T[0] + 40, T[1]], M1], false); ray(c, [M1, M2], false); ray(c, [M2, [Toy[0] + 60, Toy[1]]], true);
  mirrorBar(c, 700, 220, 820, 340, 24); mirrorBar(c, 700, 860, 820, 740, 24);
  torch(c, T[0] + 30, T[1], 0);
  shape(c, () => ell(c, Toy[0], Toy[1], 80, 80), "rgba(255,211,77,0.45)", 0);
  toy(c, Toy[0], Toy[1], 0.9);
};

// 11 c2: see the back of your head (seen from above)
const c2 = (c: Ctx) => {
  ground(c);
  mirrorBar(c, 100, 930, 980, 930, 40);
  const H = [540, 640], E = [610, 440], M = [820, 330];
  const P1 = [540 + (800 - 540) * 0 + 0, 0]; const Mp = [M[0], 2 * 930 - M[1]]; const t = (930 - H[1]) / (Mp[1] - H[1]); P1[0] = H[0] + (Mp[0] - H[0]) * t; P1[1] = 930;
  ray(c, [[H[0], H[1] + 20], P1], false); ray(c, [P1, M], false); ray(c, [M, [E[0] + 30, E[1] + 20]], true);
  shape(c, () => ell(c, 540, 560, 190, 70), CLOTH.child, 6);
  shape(c, () => ell(c, 540, 510, 105, 130), CLOTH.hair, 6);
  shape(c, () => ell(c, 540, 450, 80, 75), SKIN.child, 5);
  shape(c, () => polyP(c, [[515, 385], [565, 385], [540, 350]]), SKIN.child, 5);
  shape(c, () => ell(c, 512, 440, 9, 12), INK, 0); shape(c, () => ell(c, 568, 440, 9, 12), INK, 0);
  const i1 = norm(P1[0] - M[0], P1[1] - M[1]), i2 = norm(E[0] + 30 - M[0], E[1] + 20 - M[1]), nm = norm(i1[0] + i2[0], i1[1] + i2[1]);
  mirrorBar(c, M[0] - nm[1] * 70 - nm[0] * 0, M[1] + nm[0] * 70, M[0] + nm[1] * 70, M[1] - nm[0] * 70, 20);
};

// 12 term.10: line of symmetry on a heart
const heart = () => { const c = (g: Ctx) => { g.moveTo(540, 370); g.bezierCurveTo(520, 270, 330, 220, 270, 380); g.bezierCurveTo(230, 500, 380, 640, 540, 810); g.bezierCurveTo(700, 640, 850, 500, 810, 380); g.bezierCurveTo(750, 220, 560, 270, 540, 370); g.closePath(); }; return c; };
const t10 = (c: Ctx) => {
  ground(c);
  const p = heart();
  shape(c, () => p(c), COL.pink, 8);
  c.save(); c.beginPath(); p(c); c.clip(); c.fillStyle = "rgba(255,255,255,0.3)"; c.fillRect(0, 0, 540, D); c.restore();
  c.beginPath(); p(c); c.strokeStyle = INK; c.lineWidth = 8; c.stroke();
  dashed(c, [540, 180], [540, 900], RED, 9);
  arrow(c, [[420, 960], [540, 1000], [660, 960]]);
};

// 13 term.6: a light ray from a torch
const t6 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 820, 150, 200, 700, 0), "#e7d7bd", 6);
  torch(c, 330, 540, 0);
  ray(c, [[340, 540], [850, 540]], true);
  shape(c, () => ell(c, 850, 540, 30, 30), WHITE, 5);
};

// 14 expl.2: smooth surface vs rough surface
const e2x = (c: Ctx) => {
  ground(c);
  line(c, [[540, 60], [540, 1020]], 6, COL.grey);
  mirrorBar(c, 100, 770, 480, 770, 40);
  [190, 280, 370].forEach((x) => { ray(c, [[x - 150, 620], [x, 770]], false); ray(c, [[x, 770], [x + 150, 620]], true); });
  const wall = [[580, 900], [580, 770]]; for (let x = 600; x <= 1000; x += 40) wall.push([x, (x / 40) % 2 ? 748 : 780]); wall.push([1020, 770], [1020, 900]);
  shape(c, () => polyP(c, wall), "#d8c9b0", 6);
  const pts: [number[], number[], number[]][] = [[[580, 602], [730, 752], [660, 610]], [[670, 618], [820, 768], [820, 610]], [[760, 602], [910, 752], [1010, 620]]];
  pts.forEach(([s, m, o]) => { ray(c, [s, m], false); ray(c, [m, o], true); });
};

// 15 expl.3: the image is as far behind as you are in front
const e3x = (c: Ctx) => {
  ground(c);
  line(c, [[40, 900], [1040, 900]], 6, COL.grey);
  mirrorBar(c, 540, 220, 540, 920, 30);
  shadow(c, 230, 905, 140, 20);
  person(c, 230, 900, 560, { armR: [-0.9, -1.4] });
  c.save(); c.globalAlpha = 0.5; person(c, 850, 900, 560, { armL: [Math.PI + 0.9, Math.PI + 1.4] }); c.restore();
  arrow(c, [[260, 970], [520, 970]]); arrow(c, [[520, 970], [260, 970]]);
  arrow(c, [[570, 970], [830, 970]]); arrow(c, [[830, 970], [570, 970]]);
};

export const ic_lightReflectionL3 = cards("sci.light.reflection.L3 cards", [summary, e1, e2, e3, a1, a2, a5, a7, a9, p1, c1, c2, t10, t6, e2x, e3x]);
