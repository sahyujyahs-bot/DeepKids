import type { Ctx } from "./core";
import { D, INK, BG, RED, WHITE, COL, SKIN, CLOTH, cards, ground, shape, ell, polyP, rrect, shadow, shade, line, arrow, write, person, bowl, rnd } from "./flatKit";

// ANIMAL SOCIETIES L3 · fill cards: the ant sugar-drop test (e1), asking the elders on a video call (e2),
// the finished ant road map of the kitchen (p1).

// a small black ant walking at angle an, body centre (x, y), size s (1 = about 40 px long)
const ant = (c: Ctx, x: number, y: number, an: number, s = 1) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  for (const k of [-1, 1]) { line(c, [[-6, 0], [-14, k * 9], [-22, k * 13]], 2.5); line(c, [[2, 0], [2, k * 11], [4, k * 15]], 2.5); line(c, [[10, 0], [16, k * 9], [22, k * 12]], 2.5); }
  shape(c, () => ell(c, -14, 0, 11, 7), COL.black, 2.5); shape(c, () => ell(c, 0, 0, 7, 5), COL.black, 2.5); shape(c, () => ell(c, 13, 0, 7, 6), COL.black, 2.5);
  line(c, [[18, -3], [27, -10]], 2); line(c, [[18, 3], [27, 10]], 2);
  c.restore();
};

// a foil square lying on the floor with a sugar drop on it; strong = big sticky drop with sugar grains
const square = (c: Ctx, x: number, y: number, strong: boolean) => {
  shadow(c, x + 14, y + 20, 165, 70);
  shape(c, () => polyP(c, [[x - 150, y - 60], [x + 160, y - 70], [x + 150, y + 60], [x - 160, y + 70]]), COL.steelIn, 6);
  shade(c, () => polyP(c, [[x - 150, y - 60], [x + 160, y - 70], [x + 150, y + 60], [x - 160, y + 70]]), COL.steelDk, 40, 20, 0.35);
  shape(c, () => ell(c, x, y, strong ? 78 : 62, strong ? 38 : 30), strong ? "#fff3cf" : "rgba(214,236,250,0.75)", 5);
  if (strong) { const r = rnd(3); for (let i = 0; i < 18; i++) shape(c, () => ell(c, x - 55 + r() * 110, y - 20 + r() * 40, 5, 4), WHITE, 2); }
  shape(c, () => ell(c, x - 25, y - 10, 14, 6), WHITE, 0);
};

// e1: a weak drop and a strong drop beside an ant road; the colony has chosen the strong one
const e1 = (c: Ctx) => {
  ground(c);
  // floor tiles
  c.strokeStyle = "rgba(43,35,64,0.12)"; c.lineWidth = 4;
  for (let x = 0; x <= D; x += 270) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, D); c.stroke(); }
  for (let y = 0; y <= D; y += 270) { c.beginPath(); c.moveTo(0, y); c.lineTo(D, y); c.stroke(); }
  // the ant road along the bottom
  const r = rnd(11);
  for (let i = 0; i < 26; i++) ant(c, 30 + i * 41, 930 + Math.sin(i * 0.8) * 10, (r() - 0.5) * 0.4, 0.95);
  square(c, 290, 560, false);
  square(c, 790, 560, true);
  // the few on the weak drop, the crowd on the strong drop and the line walking to it
  ant(c, 250, 565, 0.6, 1); ant(c, 325, 550, 3.5, 1);
  const rs = rnd(5);
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; ant(c, 790 + Math.cos(a) * (84 + rs() * 8), 560 + Math.sin(a) * (44 + rs() * 6), a + Math.PI, 1); }
  for (let i = 0; i < 7; i++) ant(c, 840 + i * 9 - i * i * 1.5, 650 + i * 38, -Math.PI / 2 + 0.3, 0.95);
  arrow(c, [[700, 900], [810, 760], [830, 660]]);
  // the counts, on little paper tags
  const tag = (x: number, y: number, t: string) => { shape(c, () => rrect(c, x - 70, y - 48, 140, 96, 14), COL.paper, 5); write(c, t, x - (t.length * 0.8 * 60) / 2 + 6, y - 30, 60, INK, 8); };
  tag(290, 330, "2"); tag(790, 330, "16");
};

// e2: a child with a notebook asks a grandmother on a video call
const e2 = (c: Ctx) => {
  ground(c);
  // table
  shape(c, () => rrect(c, 60, 700, 960, 60, 14), COL.wood); c.fillStyle = COL.woodDk; c.fillRect(63, 740, 954, 17);
  // the phone, propped up, with the grandmother on the screen
  shadow(c, 760, 760, 190, 22);
  shape(c, () => rrect(c, 580, 190, 360, 540, 36), COL.black, 7);
  shape(c, () => rrect(c, 602, 230, 316, 470, 18), COL.sky, 4);
  const hx = 760, hy = 440, hd = 90;
  shape(c, () => rrect(c, hx - 120, hy + 70, 240, 180, 50), COL.purple, 6);
  shape(c, () => ell(c, hx, hy, hd, hd * 1.08), SKIN.adult);
  shape(c, () => { c.moveTo(hx - hd * 1.05, hy); c.bezierCurveTo(hx - hd, hy - hd * 1.6, hx + hd, hy - hd * 1.6, hx + hd * 1.05, hy); c.quadraticCurveTo(hx, hy - hd * 0.6, hx - hd * 1.05, hy); c.closePath(); }, COL.grey, 5);
  shape(c, () => ell(c, hx, hy - hd * 1.1, hd * 0.4, hd * 0.3), COL.grey, 5);
  for (const s of [-1, 1]) { shape(c, () => ell(c, hx + s * hd * 0.38, hy + hd * 0.1, hd * 0.26, hd * 0.22), "rgba(255,255,255,0.4)", 5); shape(c, () => ell(c, hx + s * hd * 0.38, hy + hd * 0.12, hd * 0.09, hd * 0.12), INK, 0); }
  line(c, [[hx - hd * 0.12, hy + hd * 0.1], [hx + hd * 0.12, hy + hd * 0.1]], 5);
  c.beginPath(); c.arc(hx, hy + hd * 0.4, hd * 0.32, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  shape(c, () => ell(c, hx - hd * 0.55, hy + hd * 0.35, 14, 9), "rgba(242,154,180,0.6)", 0); shape(c, () => ell(c, hx + hd * 0.55, hy + hd * 0.35, 14, 9), "rgba(242,154,180,0.6)", 0);
  // grandmother's speech bubble: dots, she is answering
  shape(c, () => { c.moveTo(600, 260); c.quadraticCurveTo(620, 215, 700, 215); c.lineTo(760, 215); c.quadraticCurveTo(840, 215, 840, 265); c.quadraticCurveTo(840, 310, 760, 310); c.lineTo(690, 310); c.lineTo(640, 345); c.lineTo(655, 310); c.quadraticCurveTo(600, 305, 600, 260); c.closePath(); }, WHITE, 5);
  for (let i = 0; i < 3; i++) shape(c, () => ell(c, 680 + i * 40, 263, 10, 10), INK, 0);
  // the child, sitting at the table, pencil in hand
  person(c, 250, 700, 560, { sit: true, armL: [Math.PI * 0.6, Math.PI * 0.15], armR: [Math.PI * 0.4, Math.PI * 0.9] });
  // the notebook on the table: six question lines, three ticked
  shadow(c, 300, 712, 170, 14);
  c.save(); c.translate(300, 690); c.transform(1, 0, -0.5, 0.55, 0, 0);
  shape(c, () => rrect(c, -150, -170, 300, 190, 10), COL.paper, 6);
  line(c, [[0, -165], [0, 15]], 3, COL.grey);
  for (let i = 0; i < 3; i++) { line(c, [[-125, -135 + i * 55], [-30, -135 + i * 55]], 5, COL.steelDk); line(c, [[25, -135 + i * 55], [120, -135 + i * 55]], 5, COL.steelDk); }
  for (let i = 0; i < 3; i++) line(c, [[-128, -138 + i * 55], [-118, -124 + i * 55], [-98, -150 + i * 55]], 6, COL.green);
  c.restore();
  line(c, [[300, 580], [335, 620]], 10, INK); line(c, [[303, 584], [332, 616]], 5, COL.yellow);
  // the question goes from the child to the phone
  arrow(c, [[380, 330], [470, 290], [560, 300]]);
};

// p1: the finished ant road map of the kitchen, counts and the nest star
const p1 = (c: Ctx) => {
  ground(c, COL.wood);
  c.fillStyle = COL.woodDk; for (let y = 0; y < D; y += 180) c.fillRect(0, y, D, 8);
  // the sheet of paper
  shadow(c, 560, 580, 440, 440);
  shape(c, () => rrect(c, 90, 90, 900, 900, 18), COL.paper, 7);
  // the kitchen from above: walls, platform along the top, sink, window, door gap
  shape(c, () => rrect(c, 160, 160, 760, 760, 6), "#fdf6e3", 8);
  shape(c, () => rrect(c, 160, 160, 760, 150, 4), COL.steelIn, 6);
  shape(c, () => rrect(c, 640, 190, 200, 90, 12), COL.water, 6); shape(c, () => ell(c, 740, 200, 10, 10), COL.steelDk, 3);
  shape(c, () => rrect(c, 300, 140, 220, 24, 4), COL.sky, 5); line(c, [[410, 140], [410, 164]], 4);
  shape(c, () => rrect(c, 160, 700, 150, 220, 4), COL.steel, 6); // fridge
  shape(c, () => rrect(c, 720, 900, 200, 30, 4), COL.brown, 5); // door
  // the ant roads: wavy pencil lines along the walls, from the nest to the sink and the platform
  const road = (pts: number[][]) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) c.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); c.strokeStyle = INK; c.lineWidth = 7; c.lineCap = "round"; c.setLineDash([]); c.stroke(); };
  const wav = (a: number[], b: number[], n = 10) => { const out: number[][] = []; for (let i = 0; i <= n; i++) { const t = i / n, dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); out.push([a[0] + dx * t - (dy / l) * Math.sin(i * 2.4) * 9, a[1] + dy * t + (dx / l) * Math.sin(i * 2.4) * 9]); } return out; };
  const nest = [900, 560];
  road(wav(nest, [880, 330])); road(wav([880, 330], [700, 290]));
  road(wav(nest, [890, 880])); road(wav([890, 880], [330, 890])); road(wav([330, 890], [320, 720]));
  road(wav(nest, [600, 560])); road(wav([600, 560], [330, 330]));
  const r = rnd(21);
  [[884, 450], [800, 300], [893, 760], [600, 885], [420, 890], [470, 450], [760, 560]].forEach(([x, y], i) => ant(c, x, y, r() * 6.3, 0.75));
  // the nest entrance: a red star
  const star = (x: number, y: number, R: number) => { const p: number[][] = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? R * 0.45 : R; p.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); } shape(c, () => polyP(c, p), RED, 5); };
  star(nest[0], nest[1], 44);
  arrow(c, [[720, 700], [850, 600]]);
  // the counts: morning sun 6, evening moon 20
  shape(c, () => ell(c, 250, 470, 36, 36), COL.yellow, 5); for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; line(c, [[250 + Math.cos(a) * 48, 470 + Math.sin(a) * 48], [250 + Math.cos(a) * 62, 470 + Math.sin(a) * 62]], 5, COL.orange); }
  write(c, "6", 330, 440, 70, INK, 8);
  shape(c, () => { c.arc(250, 610, 38, Math.PI * 0.3, Math.PI * 1.7); c.arc(272, 610, 32, Math.PI * 1.55, Math.PI * 0.45, true); c.closePath(); }, COL.yellow, 5);
  write(c, "20", 330, 580, 70, INK, 8);
};

export const ic_animalBehaviourAnimalSocietiesL3Fill = cards("sci.animal-behaviour.animal-societies.L3 fill", [e1, e2, p1]);
