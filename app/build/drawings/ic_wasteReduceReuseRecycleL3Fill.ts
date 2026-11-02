import type { Ctx } from "./core";
import { D, INK, BG, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, write, cards } from "./flatKit";

// REDUCE, REUSE, RECYCLE (L3) · fill cards: cover, summary, crayons remade, the bag test, recycled paper.

// a banana peel lying flat, its middle at (x, y); rot 0..1 = how brown and shrunken it is
const peel = (c: Ctx, x: number, y: number, s: number, rot = 0) => {
  const col = rot > 0.5 ? COL.soilDk : rot > 0 ? COL.brown : COL.yellow, dk = rot > 0.5 ? INK : rot > 0 ? COL.soilDk : COL.orange;
  const k = 1 - rot * 0.35;
  const body = () => { c.moveTo(x - 150 * s * k, y + 20 * s); c.quadraticCurveTo(x - 80 * s, y - 70 * s * k, x, y - 30 * s); c.quadraticCurveTo(x + 80 * s, y - 80 * s * k, x + 150 * s * k, y + 10 * s); c.quadraticCurveTo(x + 60 * s, y + 50 * s * k, x, y + 30 * s); c.quadraticCurveTo(x - 60 * s, y + 60 * s * k, x - 150 * s * k, y + 20 * s); c.closePath(); };
  shape(c, body, col, 6);
  shade(c, body, dk, 14 * s, 10 * s);
  if (rot > 0) { const r = rnd(3); for (let i = 0; i < 9; i++) shape(c, () => ell(c, x + (r() - 0.5) * 220 * s * k, y + (r() - 0.5) * 50 * s, 10 * s, 7 * s), INK, 0); }
};
// a clear plastic bottle standing, bottom centre (x, y)
const bottle = (c: Ctx, x: number, y: number, h: number) => {
  const w = h * 0.3;
  shadow(c, x + w * 0.2, y + 6, w * 0.9, w * 0.2);
  const body = () => { c.moveTo(x - w, y); c.lineTo(x - w, y - h * 0.62); c.quadraticCurveTo(x - w, y - h * 0.78, x - w * 0.35, y - h * 0.84); c.lineTo(x - w * 0.35, y - h); c.lineTo(x + w * 0.35, y - h); c.lineTo(x + w * 0.35, y - h * 0.84); c.quadraticCurveTo(x + w, y - h * 0.78, x + w, y - h * 0.62); c.lineTo(x + w, y); c.closePath(); };
  shape(c, body, COL.glass, 6);
  shade(c, body, COL.glassEdge, w * 0.45, 0, 0.35);
  shape(c, () => rrect(c, x - w * 0.42, y - h * 1.06, w * 0.84, h * 0.1, 6), COL.blue, 5);
  shape(c, () => rrect(c, x - w, y - h * 0.5, w * 2, h * 0.22, 4), COL.red, 5);
  shine(c, [[x - w * 0.7, y - h * 0.7], [x - w * 0.7, y - h * 0.15]], 8);
};
// a small round microbe with eyes, happily eating; (x, y) centre
const microbe = (c: Ctx, x: number, y: number, r: number, col: string) => {
  shape(c, () => ell(c, x, y, r, r * 0.85), col, 4);
  for (let i = 0; i < 5; i++) { const a = -0.8 + i * 0.5; line(c, [[x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.75], [x + Math.cos(a) * r * 1.5, y + Math.sin(a) * r * 1.3]], 4); }
  shape(c, () => ell(c, x - r * 0.3, y - r * 0.15, r * 0.14, r * 0.18), INK, 0); shape(c, () => ell(c, x + r * 0.3, y - r * 0.15, r * 0.14, r * 0.18), INK, 0);
  c.beginPath(); c.arc(x, y + r * 0.2, r * 0.3, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};
// a dark soil band from y down, with a few stones
const soil = (c: Ctx, y: number) => {
  shape(c, () => { c.moveTo(0, y); c.quadraticCurveTo(270, y - 30, 540, y); c.quadraticCurveTo(810, y + 30, D, y); c.lineTo(D, D); c.lineTo(0, D); c.closePath(); }, COL.soil, 6);
  const r = rnd(11); for (let i = 0; i < 14; i++) shape(c, () => ell(c, 40 + r() * 1000, y + 60 + r() * (D - y - 90), 12 + r() * 10, 9 + r() * 6), COL.soilDk, 3);
};

// card 0 · cover: in one soil bed, the peel has rotted away while the bottle stays whole
const cover = (c: Ctx) => {
  ground(c, COL.sky);
  soil(c, 560);
  // sun-side: a fresh peel being buried (left, above), the same peel months later (left, below) is brown and small
  peel(c, 280, 440, 1.6, 0);
  peel(c, 280, 850, 1.3, 0.9);
  arrow(c, [[280, 560], [280, 740]]);
  // the bottle: whole above, and still whole below the ground
  bottle(c, 790, 530, 400);
  bottle(c, 790, 1000, 330);
  arrow(c, [[940, 600], [940, 760]]);
};

// card 1 · summary: microbes feast on the peel; none of them can bite the plastic
const summary = (c: Ctx) => {
  ground(c);
  shape(c, () => { c.moveTo(0, 740); c.lineTo(D, 740); c.lineTo(D, D); c.lineTo(0, D); c.closePath(); }, COL.soil, 6);
  peel(c, 330, 560, 1.25, 0.35);
  const m = [[200, 480, COL.greenLt], [310, 640, COL.teal], [440, 470, COL.pink], [470, 620, COL.greenLt], [150, 600, COL.purple]];
  m.forEach(([x, y, col]) => microbe(c, x as number, y as number, 34, col as string));
  bottle(c, 800, 720, 420);
  // microbes bounce off the plastic: a small red cross over each
  const n = [[640, 420], [960, 560], [660, 640]];
  n.forEach(([x, y]) => { microbe(c, x, y, 30, COL.teal); line(c, [[x + 44, y - 44], [x + 84, y - 4]], 8, RED); line(c, [[x + 84, y - 44], [x + 44, y - 4]], 8, RED); });
};

// card 2 · e2: broken crayon bits in a mould, heat under it, out comes a new crayon that draws
const crayons = (c: Ctx) => {
  ground(c);
  // a steel muffin tray with two cups: one colour, one mixed
  shadow(c, 420, 640, 330, 40);
  shape(c, () => polyP(c, [[110, 440], [700, 440], [740, 620], [70, 620]]), COL.steel);
  shade(c, () => polyP(c, [[110, 440], [700, 440], [740, 620], [70, 620]]), COL.steelDk, 60, 0);
  const cup = (x: number, cols: string[]) => {
    shape(c, () => ell(c, x, 530, 120, 55), COL.steelIn, 5);
    const r = rnd(x);
    cols.forEach((col, i) => { for (let k = 0; k < 4; k++) { const px = x - 70 + r() * 140, py = 505 + r() * 45, a = r() * 3; shape(c, () => { c.save(); c.translate(px, py); c.rotate(a); rrect(c, -34, -12, 68, 24, 6); c.restore(); }, col, 4); } });
  };
  cup(260, [COL.red]); cup(560, [COL.red, COL.blue, COL.yellow]);
  // heat below: red wavy lines rising from a flame
  for (const x of [250, 400, 550]) line(c, [[x, 700], [x - 14, 670], [x + 14, 640], [x, 610]], 7, RED);
  // the new crayon that came out, drawing a purple-brown stroke on paper
  shape(c, () => rrect(c, 420, 760, 560, 260, 12), COL.paper, 5);
  line(c, [[480, 930], [560, 880], [660, 940], [760, 870], [840, 920]], 16, "#7a4a6a");
  arrow(c, [[700, 560], [880, 720]]);
  c.save(); c.translate(900, 880); c.rotate(-0.9);
  shape(c, () => rrect(c, -40, -150, 80, 300, 10), "#7a4a6a", 6);
  shape(c, () => polyP(c, [[-40, 150], [40, 150], [0, 210]]), "#7a4a6a", 6);
  shape(c, () => rrect(c, -40, -60, 80, 120, 4), COL.paper, 5);
  c.restore();
};

// card 3 · e3: a bag held up by its handles, 1 kg weights inside, which one tears first?
const bagTest = (c: Ctx) => {
  ground(c);
  // the four bags in a row behind, small: newspaper, T-shirt, cloth, thin plastic
  const small = (x: number, col: string, dk: string) => { shadow(c, x + 10, 350, 70, 14); shape(c, () => rrect(c, x - 60, 230, 120, 120, 10), col, 5); shade(c, () => rrect(c, x - 60, 230, 120, 120, 10), dk, 16, 0); line(c, [[x - 30, 232], [x - 30, 180], [x + 30, 180], [x + 30, 232]], 7); };
  small(140, COL.paper, COL.grey); small(380, COL.pink, COL.red); small(700, COL.green, COL.greenDk); small(940, COL.sky, COL.glassEdge);
  // the big cloth bag under test, bulging at the bottom with weights
  const bag = () => { c.moveTo(380, 540); c.lineTo(700, 540); c.lineTo(740, 900); c.quadraticCurveTo(540, 960, 340, 900); c.closePath(); };
  shadow(c, 560, 960, 200, 22);
  shape(c, bag, COL.green, 6);
  shade(c, bag, COL.greenDk, 50, 0);
  // weights showing through the open top
  shape(c, () => ell(c, 540, 540, 160, 30), COL.greenDk, 5);
  for (const [x, y] of [[470, 520], [610, 520]]) { shape(c, () => rrect(c, x - 60, y - 40, 120, 60, 10), COL.black, 5); line(c, [[x - 20, y - 40], [x - 20, y - 70], [x + 20, y - 70], [x + 20, y - 40]], 8); write(c, "1", x - 10, y - 32, 36, WHITE, 6); }
  // handles up to a child's hand, lifting
  line(c, [[420, 540], [430, 380], [540, 330], [650, 380], [660, 540]], 12);
  hand(c, 540, 330, Math.PI / 2, 1.1, SKIN.child, CLOTH.child);
  arrow(c, [[860, 760], [860, 600]]);
};

// card 4 · p1: the net frame lifted out of grey pulp, a wet sheet of new paper on it
const paper = (c: Ctx) => {
  ground(c);
  // the wide tub of pulp water
  shadow(c, 560, 960, 420, 40);
  shape(c, () => polyP(c, [[120, 640], [960, 640], [910, 940], [170, 940]]), COL.blue);
  shade(c, () => polyP(c, [[120, 640], [960, 640], [910, 940], [170, 940]]), COL.blueDk, 90, 0);
  shape(c, () => ell(c, 540, 640, 420, 70), COL.grey, 6);
  const r = rnd(5); for (let i = 0; i < 40; i++) shape(c, () => ell(c, 180 + r() * 720, 615 + r() * 50, 7 + r() * 8, 4 + r() * 4), COL.paper, 2);
  // drips falling back
  for (const x of [320, 540, 760]) shape(c, () => { c.moveTo(x, 440); c.quadraticCurveTo(x - 12, 500, x, 540); c.quadraticCurveTo(x + 12, 500, x, 440); c.closePath(); }, COL.grey, 3);
  // the frame with net, seen slightly from above, pulp sheet lying on it
  const frame = () => polyP(c, [[210, 300], [870, 300], [920, 420], [160, 420]]);
  shape(c, frame, COL.wood, 6);
  shade(c, frame, COL.woodDk, 30, 0);
  const net = () => polyP(c, [[270, 322], [810, 322], [850, 398], [230, 398]]);
  shape(c, net, COL.grey, 4);
  c.save(); c.beginPath(); net(); c.clip(); c.globalAlpha = 0.5; for (let x = 240; x < 860; x += 22) line(c, [[x, 322], [x - 20, 398]], 2, COL.paper); for (let y = 330; y < 398; y += 14) line(c, [[200, y], [900, y]], 2, COL.paper); c.restore();
  // two grown-up hands at the ends, lifting
  hand(c, 140, 360, 0, 1.0, SKIN.adult, CLOTH.adult);
  c.save(); c.translate(940, 360); c.scale(-1, 1); hand(c, 0, 0, 0, 1.0, SKIN.adult, CLOTH.adult); c.restore();
  arrow(c, [[1000, 560], [1000, 200]]);
  // the finished card standing in the corner, a leaf pressed on it
  shape(c, () => rrect(c, 60, 60, 240, 180, 8), "#e9e2d2", 5);
  line(c, [[90, 120], [250, 120]], 5, COL.greyDk); line(c, [[90, 160], [230, 160]], 5, COL.greyDk); line(c, [[90, 200], [200, 200]], 5, COL.greyDk);
};

export const ic_wasteReduceReuseRecycleL3Fill = cards("sci.waste.reduce-reuse-recycle.L3 fill", [cover, summary, crayons, bagTest, paper]);
