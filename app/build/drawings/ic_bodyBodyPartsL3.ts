import type { Ctx } from "./core";
import { BG, COL, CLOTH, INK, RED, SKIN, WHITE, arrow, cards, ell, glass, ground, line, polyP, rrect, shade, shadow, shape, shine, person, hand, write } from "./flatKit";

// sci.body.body-parts.L3 · picture cards for the intro, summary, activities, terms. Flat DeepKids look;
// the same child (orange shirt) and the same skin tone on every card; red arrows = movement.

const PI = Math.PI, PINK = "#f29ab4", PINKDK = "#d9708f", TOOTH = "#fbf8ee", TOOTHDK = "#e0d8c0", CREAM = "#fff2d6";
const ring = (c: Ctx, x: number, y: number, r: number, fill: string = WHITE) => shape(c, () => ell(c, x, y, r, r), fill, 6);
// clip to a circle, draw inside, restore; then the ring edge on top
const lens = (c: Ctx, x: number, y: number, r: number, fill: string, inner: () => void) => {
  c.save(); c.beginPath(); ell(c, x, y, r, r); c.clip(); c.fillStyle = fill; c.fillRect(x - r, y - r, r * 2, r * 2); inner(); c.restore();
  c.beginPath(); ell(c, x, y, r, r); c.lineWidth = 8; c.strokeStyle = INK; c.stroke();
};
// a swirling fingerprint (whorl): an elliptical spiral
const whorl = (c: Ctx, x: number, y: number, r: number, col = INK, w = 5, turns = 7) => {
  const pts: number[][] = [];
  for (let t = 0; t <= turns * 2 * PI; t += 0.12) { const k = t / (turns * 2 * PI) * r; pts.push([x + Math.cos(t) * k * 0.82, y + Math.sin(t) * k * 1.0]); }
  line(c, pts, w, col);
};
// a face, front view; open = eye lids open, mouth: "smile" | "o" | "gap"
const face = (c: Ctx, x: number, y: number, r: number, o: { sweat?: boolean; mouth?: string; shut?: boolean } = {}) => {
  shape(c, () => ell(c, x, y, r, r * 1.05), SKIN.child);
  shape(c, () => { c.moveTo(x - r * 1.02, y); c.bezierCurveTo(x - r, y - r * 1.5, x + r, y - r * 1.5, x + r * 1.02, y); c.quadraticCurveTo(x, y - r * 0.55, x - r * 1.02, y); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, x + r * 0.95, y - r * 0.2, r * 0.32, r * 0.55), CLOTH.hair, 4);
  for (const s of [-1, 1]) {
    if (o.shut) line(c, [[x + s * r * 0.5, y + r * 0.1], [x + s * r * 0.35, y + r * 0.16], [x + s * r * 0.2, y + r * 0.1]], 5);
    else shape(c, () => ell(c, x + s * r * 0.35, y + r * 0.08, r * 0.09, r * 0.12), INK, 0);
  }
  line(c, [[x, y + r * 0.22], [x - r * 0.07, y + r * 0.4], [x + r * 0.07, y + r * 0.4]], 4, SKIN.childDk);
  if (o.mouth === "o") shape(c, () => ell(c, x, y + r * 0.62, r * 0.14, r * 0.17), INK, 0);
  else { c.beginPath(); c.arc(x, y + r * 0.5, r * 0.3, 0.2, PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
  if (o.sweat) for (const [dx, dy] of [[-0.55, -0.25], [0.6, -0.3], [-0.7, 0.2], [0.72, 0.15]]) drop(c, x + dx * r, y + dy * r, r * 0.13, COL.drop);
};
// a drop with a point at the top, base centre (x, y)
const drop = (c: Ctx, x: number, y: number, r: number, col: string = COL.water) =>
  shape(c, () => { c.moveTo(x, y - r * 2.1); c.quadraticCurveTo(x - r * 1.2, y - r * 0.6, x - r, y); c.arc(x, y, r, PI, 0, true); c.quadraticCurveTo(x + r * 1.2, y - r * 0.6, x, y - r * 2.1); c.closePath(); }, col, Math.max(3, r * 0.22));
// an eye: almond, iris, pupil; lid 0 (open) .. 1 (shut); lashes on top
const eye = (c: Ctx, x: number, y: number, w: number, lid = 0, lashes = true) => {
  const h = w * 0.5, path = () => { c.moveTo(x - w, y); c.quadraticCurveTo(x, y - h * 2, x + w, y); c.quadraticCurveTo(x, y + h * 1.7, x - w, y); c.closePath(); };
  shape(c, path, WHITE, 6);
  c.save(); c.beginPath(); path(); c.clip();
  shape(c, () => ell(c, x, y, h * 0.85, h * 0.85), "#7a4a2a", 4); shape(c, () => ell(c, x, y, h * 0.4, h * 0.4), INK, 0);
  c.beginPath(); ell(c, x - h * 0.28, y - h * 0.3, h * 0.14, h * 0.14); c.fillStyle = WHITE; c.fill();
  if (lid > 0) { const ly = y - h + lid * h * 1.7; c.beginPath(); c.rect(x - w, y - h * 2, w * 2, ly - (y - h * 2)); c.fillStyle = SKIN.child; c.fill(); line(c, [[x - w, ly], [x, ly + h * 0.35], [x + w, ly]], 6); }
  c.restore();
  c.beginPath(); path(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  if (lashes) for (let i = 0; i < 7; i++) { const t = (i + 0.5) / 7, ax = x - w + t * w * 2, ay = y - h * 2 * (1 - (2 * t - 1) ** 2) / 2 * 1.0 + (lid > 0 ? lid * h * 1.7 * (1 - (2 * t - 1) ** 2) * 0.5 : 0); line(c, [[ax, ay], [ax + (t - 0.5) * w * 0.5, ay - w * 0.28]], 5); }
};
// an ear seen from the side (outer ear), centre (x, y), half height s
const ear = (c: Ctx, x: number, y: number, s: number, skin: string = SKIN.child) => {
  shape(c, () => { c.moveTo(x - s * 0.1, y - s); c.bezierCurveTo(x + s * 0.9, y - s * 1.1, x + s * 0.9, y + s * 0.4, x + s * 0.3, y + s * 0.8); c.bezierCurveTo(x + s * 0.1, y + s * 1.05, x - s * 0.4, y + s * 1.05, x - s * 0.45, y + s * 0.6); c.lineTo(x - s * 0.3, y - s * 0.4); c.bezierCurveTo(x - s * 0.4, y - s * 0.8, x - s * 0.3, y - s * 0.95, x - s * 0.1, y - s); c.closePath(); }, skin, 6);
  line(c, [[x + s * 0.5, y - s * 0.5], [x + s * 0.55, y + s * 0.1], [x + s * 0.25, y + s * 0.5]], 5, SKIN.childDk);
  line(c, [[x + s * 0.15, y - s * 0.55], [x - s * 0.05, y - s * 0.1], [x + s * 0.12, y + s * 0.15]], 5, SKIN.childDk);
};
// a nose, front view, centre of the tip at (x, y), size s
const nose = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x - s * 0.25, y - s * 1.1); c.quadraticCurveTo(x - s * 0.3, y - s * 0.3, x - s * 0.75, y + s * 0.15); c.quadraticCurveTo(x - s * 0.85, y + s * 0.55, x - s * 0.4, y + s * 0.6); c.quadraticCurveTo(x, y + s * 0.5, x + s * 0.4, y + s * 0.6); c.quadraticCurveTo(x + s * 0.85, y + s * 0.55, x + s * 0.75, y + s * 0.15); c.quadraticCurveTo(x + s * 0.3, y - s * 0.3, x + s * 0.25, y - s * 1.1); c.closePath(); }, SKIN.child, 6);
  for (const k of [-1, 1]) shape(c, () => ell(c, x + k * s * 0.33, y + s * 0.38, s * 0.17, s * 0.1, k * 0.3), INK, 0);
};
// a row of teeth in a mouth
const teeth = (c: Ctx, x: number, y: number, w: number) => {
  shape(c, () => { c.moveTo(x - w, y - w * 0.15); c.quadraticCurveTo(x, y - w * 0.45, x + w, y - w * 0.15); c.quadraticCurveTo(x + w * 0.8, y + w * 0.7, x, y + w * 0.75); c.quadraticCurveTo(x - w * 0.8, y + w * 0.7, x - w, y - w * 0.15); c.closePath(); }, "#c4513f", 6);
  c.save(); c.beginPath(); c.moveTo(x - w, y - w * 0.15); c.quadraticCurveTo(x, y - w * 0.45, x + w, y - w * 0.15); c.quadraticCurveTo(x + w * 0.8, y + w * 0.7, x, y + w * 0.75); c.quadraticCurveTo(x - w * 0.8, y + w * 0.7, x - w, y - w * 0.15); c.closePath(); c.clip();
  for (let i = 0; i < 6; i++) shape(c, () => rrect(c, x - w * 0.78 + i * w * 0.26, y - w * 0.3 + Math.abs(i - 2.5) * 6, w * 0.24, w * 0.4, 8), TOOTH, 4);
  c.restore();
};
// a bare foot seen from above, toes up, centre (x, y), length s
const foot = (c: Ctx, x: number, y: number, s: number, skin: string = SKIN.child) => {
  shape(c, () => { c.moveTo(x - s * 0.18, y - s * 0.22); c.bezierCurveTo(x - s * 0.34, y - s * 0.1, x - s * 0.22, y + s * 0.45, x - s * 0.12, y + s * 0.5); c.bezierCurveTo(x, y + s * 0.56, x + s * 0.2, y + s * 0.5, x + s * 0.2, y + s * 0.42); c.bezierCurveTo(x + s * 0.2, y + s * 0.15, x + s * 0.32, y - s * 0.05, x + s * 0.3, y - s * 0.2); c.closePath(); }, skin, 6);
  [[-0.2, -0.3, 0.075], [-0.07, -0.37, 0.065], [0.05, -0.37, 0.06], [0.16, -0.33, 0.055], [0.26, -0.27, 0.05]].forEach(([dx, dy, r]) => shape(c, () => ell(c, x + dx * s, y + dy * s, r * s, r * s * 1.15), skin, 5));
};
const stripes = (c: Ctx, x0: number, y0: number, x1: number, y1: number, n: number, col: string, w = 4) => { for (let i = 0; i <= n; i++) { const t = i / n; line(c, [[x0 + (x1 - x0) * t, y0], [x0 + (x1 - x0) * t, y1]], w, col); } };

// ---------------------------------------------------------------- intro: a thumbprint on a steel tumbler
const intro = (c: Ctx) => {
  ground(c);
  shadow(c, 600, 940, 330, 44);
  const body = () => { c.moveTo(340, 190); c.lineTo(760, 190); c.lineTo(720, 930); c.lineTo(380, 930); c.closePath(); };
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, 70, 0, 0.6);
  shape(c, () => ell(c, 550, 190, 210, 36), COL.steelIn, 6);
  shine(c, [[385, 270], [418, 820]], 14);
  // the misty patch holding the thumbprint
  c.globalAlpha = 0.85; shape(c, () => { ell(c, 560, 520, 150, 170); ell(c, 480, 470, 90, 90); ell(c, 640, 560, 90, 100); }, WHITE, 0); c.globalAlpha = 1;
  whorl(c, 560, 520, 125, COL.steelDk, 7, 6);
  // breath coming from the left
  [[130, 330, 62], [215, 305, 45], [165, 405, 40]].forEach(([bx, by, br]) => shape(c, () => ell(c, bx, by, br, br * 0.8), WHITE, 6));
  arrow(c, [[250, 430], [370, 480]], RED, 14);
  // small thumb with ridges, big circle at the lower left
  lens(c, 190, 800, 150, COL.cloth, () => {
    shape(c, () => rrect(c, 120, 760, 140, 260, 66), SKIN.child, 6);
    for (let i = 0; i < 6; i++) line(c, [[132, 790 + i * 20], [190, 774 + i * 20], [248, 790 + i * 20]], 4, SKIN.childDk);
  });
};

// ---------------------------------------------------------------- summary: the child and the outside parts
const summary = (c: Ctx) => {
  ground(c);
  person(c, 540, 960, 650, { armL: [PI * 1.02, PI * 1.0], armR: [-0.02, 0.0] });
  const spots: [number, number, (x: number, y: number) => void][] = [
    [160, 190, (x, y) => eye(c, x, y + 8, 62)],
    [540, 100, (x, y) => nose(c, x, y - 4, 58)],
    [920, 190, (x, y) => teeth(c, x, y + 4, 70)],
    [120, 570, (x, y) => ear(c, x - 4, y, 74)],
    [960, 570, (x, y) => { shape(c, () => rrect(c, x - 36, y - 20, 72, 110, 36), SKIN.child, 5); whorl(c, x, y - 20, 34, SKIN.childDk, 3.5, 4); }],
    [170, 930, (x, y) => foot(c, x, y, 150)],
    [900, 930, (x, y) => { shape(c, () => rrect(c, x - 62, y - 10, 124, 62, 14), SKIN.child, 5); [[-26, -52, -0.5], [28, -64, 0.4], [58, -30, 0.9]].forEach(([dx, dy, r]) => shape(c, () => ell(c, x + dx, y + dy, 20, 9, r), "#e9c9a8", 3)); arrow(c, [[x - 6, y - 14], [x - 6, y - 40]], RED, 6); }],
  ];
  const anchors = [[480, 330], [540, 360], [575, 410], [440, 450], [800, 580], [480, 800], [600, 560]];
  spots.forEach(([x, y], i) => { line(c, [[x, y], anchors[i]], 5, COL.grey); });
  spots.forEach(([x, y, f]) => { lens(c, x, y, 92, WHITE, () => f(x, y)); });
};

// ---------------------------------------------------------------- shared small things
const bread = (c: Ctx, x: number, y: number, w: number, mould = 0, seedN = 1) => {
  const h = w * 0.95;
  const outer = (k: number) => () => { const a = w * 0.45 * k, b = h * 0.5 * k; c.moveTo(x - a, y + b); c.lineTo(x - a, y - h * 0.1 * k); c.bezierCurveTo(x - w * 0.62 * k, y - h * 0.15 * k, x - w * 0.6 * k, y - b, x - w * 0.3 * k, y - b); c.lineTo(x + w * 0.3 * k, y - b); c.bezierCurveTo(x + w * 0.6 * k, y - b, x + w * 0.62 * k, y - h * 0.15 * k, x + a, y - h * 0.1 * k); c.lineTo(x + a, y + b); c.closePath(); };
  shape(c, outer(1), "#b9773c", 6); shade(c, outer(1), "#8d5528", w * 0.06, h * 0.04, 0.5); shape(c, outer(0.86), "#f6dfb0", 3);
  let s = seedN * 31 + 5; const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  c.save(); c.beginPath(); outer(0.84)(); c.clip();
  for (let i = 0; i < mould; i++) { const sx = x + (r() - 0.5) * w * 0.7, sy = y + (r() - 0.45) * h * 0.75, sr = (10 + r() * 14) * (w / 300); c.beginPath(); ell(c, sx, sy, sr, sr * 0.85); c.fillStyle = r() < 0.5 ? "#5a9a3c" : "#3f6f2c"; c.fill(); c.lineWidth = 3; c.strokeStyle = INK; c.stroke(); }
  c.restore();
};
const speck = (c: Ctx, x: number, y: number, r: number, col = "#6b5a46") => shape(c, () => { c.moveTo(x - r, y); c.lineTo(x - r * 0.3, y - r * 0.8); c.lineTo(x + r * 0.7, y - r * 0.5); c.lineTo(x + r, y + r * 0.3); c.lineTo(x + r * 0.2, y + r * 0.9); c.lineTo(x - r * 0.7, y + r * 0.6); c.closePath(); }, col, Math.max(2.5, r * 0.2));
const paper = (c: Ctx, x: number, y: number, w: number, h: number, col = WHITE) => { shadow(c, x + w / 2 + 14, y + h + 10, w * 0.52, 22); shape(c, () => rrect(c, x, y, w, h, 14), col, 6); };

// ---------------------------------------------------------------- flows
// e1: dirty hand, then mouldy bread
const flowE1 = (c: Ctx) => {
  ground(c);
  hand(c, 90, 130, 0.7, 2.1, SKIN.child, CLOTH.child, true);
  for (const [dx, dy] of [[380, 330], [330, 400], [430, 400], [470, 340], [400, 470]]) speck(c, dx, dy, 13);
  arrow(c, [[250, 520], [380, 650]], RED, 14);
  shadow(c, 720, 960, 280, 36);
  bread(c, 720, 740, 480, 12, 3);
  for (const [dx, dy, r] of [[560, 430, 11], [640, 500, 9], [720, 440, 12], [800, 510, 9]]) speck(c, dx, dy, r);
};
// e2: tape peeled off the arm, flakes on black paper in a zoom circle
const flowE2 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 20, 610, 190, 290, 30), CLOTH.child, 6); shape(c, () => rrect(c, 150, 640, 430, 230, 100), SKIN.child, 6); shade(c, () => rrect(c, 150, 640, 430, 230, 100), SKIN.childDk, 0, 40, 0.55);
  shape(c, () => polyP(c, [[200, 670], [380, 670], [380, 840], [200, 840]]), "rgba(235,246,255,0.65)", 5);
  shape(c, () => polyP(c, [[380, 670], [380, 740], [470, 560], [410, 520]]), "rgba(235,246,255,0.65)", 5);
  arrow(c, [[300, 910], [470, 960]], RED, 12);
  line(c, [[470, 560], [650, 230]], 5, COL.grey); line(c, [[380, 840], [770, 760]], 5, COL.grey);
  lens(c, 710, 450, 320, "#1d1830", () => {
    shape(c, () => rrect(c, 410, 330, 600, 240, 10), "rgba(235,246,255,0.35)", 5);
    const fl = [[500, 380, 0.3], [590, 470, -0.4], [680, 400, 0.8], [770, 500, 0.1], [860, 410, -0.7], [930, 490, 0.5], [560, 530, 0.9], [830, 360, 0.2]];
    fl.forEach(([fx, fy, rot]) => shape(c, () => { c.save(); c.translate(fx, fy); c.rotate(rot); ell(c, 0, 0, 34, 15); c.restore(); }, WHITE, 3));
  });
};
// e3: an egg half covered in toothpaste, a toothbrush
const flowE3 = (c: Ctx) => {
  ground(c);
  const eggPath = () => { c.moveTo(500, 220); c.bezierCurveTo(720, 220, 780, 560, 500, 840); c.bezierCurveTo(220, 560, 280, 220, 500, 220); c.closePath(); };
  shadow(c, 540, 880, 280, 40);
  shape(c, eggPath, "#ead3a8", 6); shade(c, eggPath, "#c9a574", 50, 20, 0.5);
  c.save(); c.beginPath(); eggPath(); c.clip();
  c.beginPath(); c.moveTo(0, 0); c.lineTo(470, 0); for (let y = 0; y <= 1080; y += 60) c.quadraticCurveTo(470 + (y % 120 === 0 ? 50 : -30), y + 30, 470, y + 60); c.lineTo(0, 1080); c.closePath();
  c.fillStyle = WHITE; c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke(); c.restore();
  shape(c, eggPath, "rgba(0,0,0,0)", 6);
  // toothbrush
  c.save(); c.translate(760, 560); c.rotate(-0.9);
  shape(c, () => rrect(c, -40, 120, 80, 250, 36), COL.blue, 6);
  shape(c, () => rrect(c, -34, -20, 68, 150, 18), COL.blueDk, 6);
  for (let i = 0; i < 5; i++) line(c, [[-24 + i * 12, -20], [-24 + i * 12, -64]], 7, WHITE);
  c.restore();
  arrow(c, [[900, 350], [770, 270]], RED, 12);
};
// a1: a child's outline on big paper, a crayon
const flowA1 = (c: Ctx) => {
  ground(c);
  paper(c, 150, 90, 780, 900, CREAM);
  const o = "#d7372b";
  shape(c, () => ell(c, 540, 270, 90, 96), "rgba(0,0,0,0)", 0);
  c.beginPath(); ell(c, 540, 270, 90, 96); c.strokeStyle = o; c.lineWidth = 14; c.stroke();
  line(c, [[455, 400], [250, 560], [235, 600]], 14, o); line(c, [[625, 400], [830, 560], [845, 600]], 14, o);
  line(c, [[455, 400], [450, 640], [470, 900], [530, 900], [540, 700], [550, 900], [610, 900], [630, 640], [625, 400], [455, 400]], 14, o);
  for (const [x, y] of [[510, 258], [570, 258]]) shape(c, () => ell(c, x, y, 8, 11), INK, 0);
  c.beginPath(); c.arc(540, 285, 26, 0.3, PI - 0.3); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  // crayon in a hand at the edge of the outline
  c.save(); c.translate(826, 826); c.rotate(-2.35); shape(c, () => rrect(c, -75, -16, 150, 32, 6), o, 5); c.restore();
  hand(c, 900, 900, -2.35, 1.5, SKIN.adult, CLOTH.adult, false);
};
// a2: a fingerprint on tape stuck on paper, a magnifying glass
const flowA2 = (c: Ctx) => {
  ground(c);
  paper(c, 120, 140, 840, 800);
  shape(c, () => rrect(c, 180, 260, 560, 360, 8), "rgba(214,236,250,0.6)", 5);
  shape(c, () => ell(c, 460, 440, 130, 160), "#cfcfd6", 0); whorl(c, 460, 440, 135, "#5a5568", 7, 6);
  c.save(); c.translate(760, 770);
  shape(c, () => rrect(c, 0, -20, 280, 40, 18), COL.brown, 6);
  c.restore();
  line(c, [[760, 770], [880, 890]], 40, INK); line(c, [[760, 770], [880, 890]], 26, COL.brown);
  lens(c, 600, 620, 220, "rgba(223,236,250,0.9)", () => whorl(c, 600, 620, 190, INK, 9, 6));
};
// a3: oily hands, water only (still yellow) and soap (clean)
const flowA3 = (c: Ctx) => {
  ground(c);
  hand(c, 240, 980, -PI / 2, 3.2, SKIN.child, CLOTH.child, true);
  hand(c, 840, 980, -PI / 2, 3.2, SKIN.child, CLOTH.child, true);
  for (const [x, y] of [[230, 780], [290, 740], [330, 810], [250, 860], [310, 880], [190, 720], [200, 820]]) shape(c, () => ell(c, x, y, 13, 13), "#f2b705", 2.5);
  [[110, 130], [230, 60], [350, 140], [160, 280], [310, 300]].forEach(([x, y]) => drop(c, x, y + 150, 24, COL.water));
  for (const [x, y, r] of [[700, 560, 50], [830, 470, 34], [960, 600, 56], [720, 760, 38], [950, 800, 44], [1000, 900, 30]]) { shape(c, () => ell(c, x, y, r, r), "rgba(255,255,255,0.8)", 4); shine(c, [[x - r * 0.5, y - r * 0.3], [x - r * 0.3, y - r * 0.6]], 5); }
  line(c, [[540, 60], [540, 1020]], 6, COL.grey);
};
// a4: a traced hand with a trusted face on every finger
const flowA4 = (c: Ctx) => {
  ground(c);
  paper(c, 100, 90, 880, 900, CREAM);
  const o = COL.orange;
  shape(c, () => { rrect(c, 340, 520, 400, 360, 70); }, WHITE, 0);
  for (const [x, y, w, h] of [[340, 400, 84, 260], [436, 320, 84, 340], [532, 290, 84, 370], [628, 340, 84, 320]]) shape(c, () => rrect(c, x, y, w, h, 42), WHITE, 0);
  shape(c, () => { c.save(); c.translate(320, 760); c.rotate(-0.9); rrect(c, -40, -240, 84, 260, 42); c.restore(); }, WHITE, 0);
  // outline in crayon
  c.save(); c.lineWidth = 12; c.strokeStyle = o; c.lineJoin = "round";
  c.beginPath(); c.moveTo(340, 880); c.lineTo(340, 440); c.arc(382, 440, 42, PI, 0); c.lineTo(424, 340);
  c.arc(478, 340, 42, PI, 0); c.lineTo(520, 300); c.arc(574, 300, 42, PI, 0); c.lineTo(616, 300); c.arc(670, 350, 42, PI, 0);
  c.lineTo(712, 520); c.lineTo(740, 560); c.lineTo(740, 800); c.quadraticCurveTo(740, 880, 660, 880); c.closePath(); c.stroke(); c.restore();
  // palm heart
  shape(c, () => { c.moveTo(540, 800); c.bezierCurveTo(420, 720, 450, 620, 540, 665); c.bezierCurveTo(630, 620, 660, 720, 540, 800); c.closePath(); }, RED, 5);
  // faces on the fingertips
  const fc = [[382, 400, 0], [478, 300, 1], [574, 270, 2], [670, 330, 0]];
  fc.forEach(([x, y, k]) => {
    shape(c, () => ell(c, x, y - 70, 52, 52), k === 0 ? "#e4b48a" : k === 1 ? "#8d5a3b" : "#b9794f", 5);
    shape(c, () => { c.moveTo(x - 54, y - 74); c.bezierCurveTo(x - 50, y - 140, x + 50, y - 140, x + 54, y - 74); c.quadraticCurveTo(x, y - 100, x - 54, y - 74); c.closePath(); }, k === 1 ? "#d9d9d9" : INK, 4);
    for (const s of [-1, 1]) shape(c, () => ell(c, x + s * 18, y - 66, 5, 7), INK, 0);
    c.beginPath(); c.arc(x, y - 52, 16, 0.2, PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  });
  c.save(); c.translate(320, 760); c.rotate(-0.9); c.beginPath(); rrect(c, -42, -240, 84, 260, 42); c.lineWidth = 12; c.strokeStyle = o; c.stroke(); c.restore();
  shape(c, () => ell(c, 250, 660, 52, 52), "#d69a70", 5);
  shape(c, () => { c.moveTo(196, 656); c.bezierCurveTo(200, 590, 300, 590, 304, 656); c.quadraticCurveTo(250, 626, 196, 656); c.closePath(); }, INK, 4);
  for (const s of [-1, 1]) shape(c, () => ell(c, 250 + s * 18, 668, 5, 7), INK, 0);
  c.beginPath(); c.arc(250, 684, 16, 0.2, PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};
// a5: an eyebrow turning drops of water aside, an eye below
const flowA5 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 40, 1000, 1000, 120), SKIN.child, 6); shade(c, () => rrect(c, 40, 40, 1000, 1000, 120), SKIN.childDk, 0, 60, 0.45);
  // eyebrow, a thick arch
  shape(c, () => { c.moveTo(210, 520); c.quadraticCurveTo(520, 270, 880, 470); c.quadraticCurveTo(540, 370, 220, 590); c.closePath(); }, CLOTH.hair, 6);
  eye(c, 540, 760, 260, 0, true);
  drop(c, 420, 340, 26, COL.water); drop(c, 560, 280, 26, COL.water); drop(c, 700, 330, 26, COL.water);
  arrow(c, [[420, 410], [330, 505]], RED, 12); arrow(c, [[700, 410], [800, 470]], RED, 12);
};
// a6: a long sari tunnel, paper balls inside moving out, a cushion at the far end
const flowA6 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 870, 460, 40);
  shape(c, () => rrect(c, 300, 340, 740, 520, 70), "#d4478a", 6);
  shade(c, () => rrect(c, 300, 340, 740, 520, 70), "#a52f66", 0, 60, 0.5);
  shape(c, () => rrect(c, 340, 400, 660, 400, 40), "#f7b6d0", 5);
  for (let i = 0; i < 6; i++) line(c, [[560 + i * 80, 345], [560 + i * 80, 380]], 6, "#f9d57a");
  [[820, 590, 40], [700, 650, 36], [900, 700, 38], [580, 580, 34], [760, 730, 32]].forEach(([x, y, r]) => shape(c, () => ell(c, x, y, r, r), WHITE, 5));
  shape(c, () => rrect(c, 40, 360, 270, 480, 40), "#5b8fd6", 6); shade(c, () => rrect(c, 40, 360, 270, 480, 40), "#3f6fb3", 40, 0, 0.5);
  line(c, [[110, 430], [110, 770]], 6, WHITE);
  arrow(c, [[480, 960], [800, 960]], RED, 16);
  line(c, [[1030, 380], [1030, 820]], 8, INK);
};
// p1: a thumbnail with a mark moving up as the nail grows, a ruler beside it
const projP1 = (c: Ctx) => {
  ground(c);
  shadow(c, 440, 1000, 230, 30);
  const th = () => rrect(c, 250, 280, 290, 720, 140);
  shape(c, th, SKIN.child); shade(c, th, SKIN.childDk, 60, 0, 0.5);
  shape(c, () => rrect(c, 290, 310, 210, 300, 80), "#f6d9c8", 6);
  shape(c, () => ell(c, 395, 530, 22, 14), RED, 4);
  shape(c, () => ell(c, 395, 450, 22, 14), "rgba(215,55,43,0.35)", 4);
  arrow(c, [[395, 505], [395, 420]], RED, 12);
  shape(c, () => rrect(c, 650, 230, 150, 700, 10), COL.wood, 6);
  for (let i = 0; i <= 14; i++) { const y = 260 + i * 46, w = i % 5 === 0 ? 70 : 38; line(c, [[650, y], [650 + w, y]], i % 5 === 0 ? 5 : 3); }
  write(c, "1", 730, 400, 56, INK, 6); write(c, "2", 730, 630, 56, INK, 6);
};
// c1: a tippy tap, a bottle on a stick with a small hole, a foot stick, a soap on a string
const chalC1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e6cf9f"; c.fillRect(0, 900, 1080, 180); line(c, [[0, 900], [1080, 900]], 6);
  shadow(c, 540, 960, 420, 36);
  line(c, [[130, 900], [130, 200]], 36, INK); line(c, [[130, 900], [130, 200]], 22, COL.wood);
  line(c, [[950, 900], [950, 200]], 36, INK); line(c, [[950, 900], [950, 200]], 22, COL.wood);
  line(c, [[130, 230], [950, 230]], 36, INK); line(c, [[130, 230], [950, 230]], 22, COL.woodDk);
  // the bottle hangs by a string, tilted, cap on the right
  line(c, [[480, 230], [480, 300]], 6); line(c, [[700, 230], [700, 330]], 6);
  c.save(); c.translate(580, 430); c.rotate(0.12);
  shape(c, () => rrect(c, -200, -100, 330, 200, 60), "rgba(214,236,250,0.65)", 6);
  shape(c, () => rrect(c, -165, 10, 260, 80, 36), COL.water, 0);
  shape(c, () => rrect(c, 130, -42, 60, 84, 12), "rgba(214,236,250,0.65)", 6);
  shape(c, () => rrect(c, 190, -40, 30, 80, 8), COL.red, 5);
  shine(c, [[-170, -60], [-90, -70]], 8);
  shape(c, () => ell(c, 108, 60, 12, 12), INK, 0);
  c.restore();
  line(c, [[780, 475], [820, 800]], 6);
  // water stream from the hole into the air and down
  c.beginPath(); c.moveTo(690, 510); c.quadraticCurveTo(700, 640, 660, 800); c.strokeStyle = COL.water; c.lineWidth = 10; c.stroke();
  shape(c, () => rrect(c, 760, 820, 140, 36, 8), COL.wood, 6);
  arrow(c, [[830, 710], [830, 790]], RED, 12);
  // soap hanging on a string from the left of the bar
  line(c, [[300, 230], [300, 420]], 6);
  shape(c, () => rrect(c, 250, 420, 100, 70, 20), PINK, 6);
  hand(c, 640, 1040, -PI / 2, 1.3, SKIN.child, CLOTH.child, true);
};
// c2: a robot head with bottle-cap eyes and curved card eyebrows turning water aside
const chalC2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 970, 400, 36);
  const box = () => rrect(c, 180, 340, 720, 600, 30);
  shape(c, box, "#c99a5e"); shade(c, box, "#a37840", 70, 0, 0.5);
  line(c, [[540, 340], [540, 940]], 5, "#a37840");
  for (const x of [380, 700]) {
    shape(c, () => ell(c, x, 650, 100, 100), COL.red, 6); shape(c, () => ell(c, x, 650, 70, 70), WHITE, 5); shape(c, () => ell(c, x, 650, 30, 30), INK, 0);
    shape(c, () => { c.moveTo(x - 150, 580); c.quadraticCurveTo(x, 440, x + 150, 580); c.lineTo(x + 150, 610); c.quadraticCurveTo(x, 490, x - 150, 610); c.closePath(); }, COL.teal, 6);
  }
  shape(c, () => rrect(c, 420, 830, 240, 30, 15), INK, 0);
  [[380, 160], [700, 150]].forEach(([x, y]) => drop(c, x, y + 90, 24, COL.water));
  arrow(c, [[380, 300], [290, 460]], RED, 12); arrow(c, [[700, 300], [800, 460]], RED, 12);
};

// ---------------------------------------------------------------- terms
const hearts = (c: Ctx, x: number, y: number, s: number) => shape(c, () => { c.moveTo(x, y + s * 0.9); c.bezierCurveTo(x - s * 1.3, y + s * 0.1, x - s * 0.7, y - s * 0.8, x, y - s * 0.3); c.bezierCurveTo(x + s * 0.7, y - s * 0.8, x + s * 1.3, y + s * 0.1, x, y + s * 0.9); c.closePath(); }, RED, 6);
// term 0: organ, eye + ear + hand each doing a job
const termOrgan = (c: Ctx) => {
  ground(c);
  const P: [number, number][] = [[540, 270], [250, 720], [830, 720]];
  lens(c, P[0][0], P[0][1], 210, WHITE, () => eye(c, 540, 270, 140, 0, true));
  lens(c, P[1][0], P[1][1], 210, WHITE, () => { ear(c, 230, 720, 130); for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(130, 720, 40 + i * 28, -0.9, 0.9); c.strokeStyle = COL.blue; c.lineWidth = 8; c.stroke(); } });
  lens(c, P[2][0], P[2][1], 210, WHITE, () => { shape(c, () => ell(c, 880, 700, 60, 60), COL.red, 6); hand(c, 700, 740, -0.15, 1.3, SKIN.child, CLOTH.child, false); });
};
// term 1: external organ, the outside parts glowing
const termExternal = (c: Ctx) => {
  ground(c);
  c.globalAlpha = 0.55; shape(c, () => { ell(c, 540, 540, 330, 480); }, COL.yellow, 0); c.globalAlpha = 1;
  for (let i = 0; i < 16; i++) { const a = (i / 16) * PI * 2; line(c, [[540 + Math.cos(a) * 395, 540 + Math.sin(a) * 530], [540 + Math.cos(a) * 455, 540 + Math.sin(a) * 600]], 10, COL.orange); }
  person(c, 540, 930, 720, { armL: [PI * 0.8, PI * 0.9], armR: [PI * 0.2, PI * 0.1] });
};
// term 2: internal organ, lungs and heart inside a see-through child
const termInternal = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 380, 950, 130, 100, 40), "rgba(255,255,255,0.45)", 6); shape(c, () => rrect(c, 570, 950, 130, 100, 40), "rgba(255,255,255,0.45)", 6);
  shape(c, () => ell(c, 540, 220, 120, 126), "rgba(255,255,255,0.45)", 6);
  shape(c, () => rrect(c, 330, 370, 420, 590, 80), "rgba(255,255,255,0.45)", 6);
  shape(c, () => rrect(c, 120, 400, 220, 80, 40), "rgba(255,255,255,0.45)", 6); shape(c, () => rrect(c, 740, 400, 220, 80, 40), "rgba(255,255,255,0.45)", 6);
  line(c, [[540, 360], [540, 500]], 14, INK); line(c, [[540, 360], [540, 500]], 7, "#f6c3cf");
  for (const s of [-1, 1]) shape(c, () => { c.moveTo(540 + s * 18, 500); c.bezierCurveTo(540 + s * 70, 440, 540 + s * 170, 450, 540 + s * 170, 560); c.bezierCurveTo(540 + s * 170, 690, 540 + s * 100, 740, 540 + s * 25, 700); c.closePath(); }, PINK, 6);
  hearts(c, 505, 640, 60);
};
// term 3: skin, a hand holding a warm steel cup, a zoom into the skin layer
const termSkin = (c: Ctx) => {
  ground(c);
  shadow(c, 380, 560, 190, 28);
  shape(c, () => polyP(c, [[200, 260], [500, 260], [470, 560], [230, 560]]), COL.steel); shade(c, () => polyP(c, [[200, 260], [500, 260], [470, 560], [230, 560]]), COL.steelDk, 50, 0, 0.55);
  shape(c, () => ell(c, 350, 260, 150, 24), COL.steelIn, 6);
  for (const x of [290, 360, 430]) { c.beginPath(); c.moveTo(x, 200); c.bezierCurveTo(x - 40, 150, x + 40, 110, x, 60); c.strokeStyle = COL.grey; c.lineWidth = 8; c.lineCap = "round"; c.stroke(); }
  hand(c, 40, 400, 0.0, 1.9, SKIN.child, CLOTH.child, false);
  line(c, [[300, 400], [610, 640]], 5, COL.grey);
  lens(c, 770, 740, 270, WHITE, () => {
    c.fillStyle = "#ead3bc"; c.fillRect(500, 620, 540, 440);
    c.fillStyle = SKIN.child; c.fillRect(500, 470, 540, 150); c.fillStyle = SKIN.childDk; c.fillRect(500, 470, 540, 36);
    for (const x of [580, 700, 830, 950]) { c.fillStyle = "#b44a3c"; c.beginPath(); ell(c, x, 750, 20, 14); c.fill(); }
    line(c, [[500, 620], [1040, 620]], 6);
    line(c, [[500, 506], [1040, 506]], 5);
  });
};
// term 4: cell, a hand zoomed into packed cells
const termCell = (c: Ctx) => {
  ground(c);
  hand(c, 10, 560, 0.0, 1.7, SKIN.child, CLOTH.child, true);
  line(c, [[190, 510], [428, 268]], 5, COL.grey); line(c, [[190, 610], [428, 792]], 5, COL.grey);
  lens(c, 680, 530, 350, "#f3d7c0", () => {
    for (let r = 0; r < 8; r++) for (let k = 0; k < 6; k++) { const x = 400 + k * 120 + (r % 2) * 60, y = 220 + r * 90; shape(c, () => rrect(c, x, y, 112, 80, 16), SKIN.child, 5); shape(c, () => ell(c, x + 56, y + 40, 16, 16), "#6a4128", 3); }
  });
};
// term 5: keratin, a nail, a cow's horn, a feather
const termKeratin = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 960, 440, 30);
  shape(c, () => rrect(c, 70, 520, 230, 440, 100), SKIN.child, 6);
  shape(c, () => rrect(c, 105, 550, 160, 230, 60), "#f6d9c8", 6);
  const horn = () => { c.moveTo(380, 960); c.bezierCurveTo(370, 640, 530, 420, 660, 320); c.bezierCurveTo(640, 480, 620, 700, 600, 960); c.closePath(); };
  shape(c, horn, "#e8dcc0", 6); shade(c, horn, "#b8a67f", 50, 0, 0.5);
  for (let i = 0; i < 4; i++) line(c, [[385 + i * 6, 940 - i * 120], [590 - i * 4, 930 - i * 120]], 4, "#b8a67f");
  c.save(); c.translate(870, 640); c.rotate(0.22);
  const vane = () => { c.moveTo(0, -320); c.bezierCurveTo(130, -250, 150, 40, 40, 290); c.lineTo(-40, 290); c.bezierCurveTo(-150, 40, -130, -250, 0, -320); c.closePath(); };
  shape(c, vane, COL.teal, 6); shade(c, vane, COL.tealDk, 40, 0, 0.5);
  line(c, [[0, -320], [0, 380]], 8);
  for (let i = 0; i < 8; i++) { line(c, [[0, -230 + i * 55], [70, -190 + i * 55]], 4, COL.tealDk); line(c, [[0, -230 + i * 55], [-70, -190 + i * 55]], 4, COL.tealDk); }
  c.restore();
};
// term 6: pores, a zoom of skin with tiny holes and sweat drops
const termPores = (c: Ctx) => {
  ground(c);
  lens(c, 540, 540, 460, SKIN.child, () => {
    for (let i = 0; i < 9; i++) line(c, [[100, 160 + i * 100], [540, 130 + i * 100], [980, 160 + i * 100]], 5, SKIN.childDk);
    for (const [x, y] of [[330, 330], [640, 270], [800, 520], [450, 580], [260, 700], [650, 760]]) { shape(c, () => ell(c, x, y, 28, 18), "#5a3320", 4); drop(c, x, y - 16, 22, COL.drop); }
  });
};
// term 7: sweat, a child after running
const termSweat = (c: Ctx) => {
  ground(c);
  face(c, 540, 520, 330, { sweat: true, mouth: "o" });
  shape(c, () => ell(c, 330, 600, 50, 30), "rgba(228,82,59,0.45)", 0); shape(c, () => ell(c, 750, 600, 50, 30), "rgba(228,82,59,0.45)", 0);
  for (const [x, y, r] of [[170, 410, 28], [920, 450, 28], [140, 650, 24], [940, 260, 24]]) drop(c, x, y, r, COL.drop);
};
// term 8: eyelid and eyelashes catching dust
const termLashes = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 200, 1000, 700, 120), SKIN.child, 6); shade(c, () => rrect(c, 40, 200, 1000, 700, 120), SKIN.childDk, 0, 50, 0.4);
  eye(c, 540, 600, 360, 0.55, false);
  // long lashes along the lid edge, one catching the dust
  const tips: number[][] = [];
  for (let i = 0; i < 8; i++) { const t = (i + 0.5) / 8, x = 540 - 330 + t * 660, y = 588 + 63 * (1 - Math.abs(2 * t - 1)) - 8, ex = x + (t - 0.5) * 120, ey = y + 130; line(c, [[x, y], [(x + ex) / 2 + (t - 0.5) * 30, y + 60], [ex, ey]], 10); tips.push([ex, ey]); }
  speck(c, tips[1][0] - 8, tips[1][1] + 26, 26);
  arrow(c, [[90, 640], [190, 740]], RED, 12);
};
// term 9: tears washing a speck to the corner of the eye
const termTears = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 40, 200, 1000, 700, 120), SKIN.child, 6); shade(c, () => rrect(c, 40, 200, 1000, 700, 120), SKIN.childDk, 0, 50, 0.4);
  eye(c, 560, 540, 380, 0, true);
  c.globalAlpha = 0.5; shape(c, () => { c.moveTo(250, 540); c.quadraticCurveTo(560, 760, 880, 540); c.quadraticCurveTo(560, 600, 250, 540); c.closePath(); }, COL.water, 0); c.globalAlpha = 1;
  arrow(c, [[780, 640], [560, 650], [350, 590]], COL.waterDk, 14);
  speck(c, 280, 560, 20);
  drop(c, 210, 720, 28, COL.drop);
};
// the ear canal cut-away, shared by earwax and eardrum
const canal = (c: Ctx) => {
  ground(c);
  ear(c, 140, 540, 230);
  const wall = () => rrect(c, 230, 330, 640, 420, 90);
  shape(c, wall, "#e9b79a", 6);
  shape(c, () => rrect(c, 270, 380, 580, 320, 60), "#7d4a3a", 5);
  shape(c, () => ell(c, 870, 540, 34, 160), "#f6e6c8", 6);
};
// term 10: earwax moving out of the ear canal
const termEarwax = (c: Ctx) => {
  canal(c);
  for (const [x, y] of [[330, 410], [440, 400], [560, 412], [670, 404], [780, 408], [350, 670], [470, 680], [600, 672], [720, 676], [810, 668]]) shape(c, () => ell(c, x, y, 52, 30), "#e0a93c", 5);
  for (const [x, y] of [[440, 415], [610, 672], [780, 420], [350, 660]]) speck(c, x, y, 12, "#6b5a46");
  arrow(c, [[780, 540], [330, 540]], RED, 16);
};
// term 11: the eardrum, a thin skin that shakes when sound arrives
const termEardrum = (c: Ctx) => {
  canal(c);
  for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(220, 540, 70 + i * 90, -0.55, 0.55); c.strokeStyle = COL.blue; c.lineWidth = 12; c.lineCap = "round"; c.stroke(); }
  shape(c, () => { c.moveTo(860, 380); c.quadraticCurveTo(830, 540, 860, 700); c.quadraticCurveTo(910, 540, 860, 380); c.closePath(); }, "#f6e6c8", 6);
  line(c, [[900, 450], [925, 540], [900, 630]], 8, COL.blue);
  line(c, [[935, 430], [965, 540], [935, 650]], 8, COL.blue);
};
// term 12: mucus and nose hairs trapping dust
const termMucus = (c: Ctx) => {
  ground(c);
  shape(c, () => { c.moveTo(80, 880); c.lineTo(80, 700); c.bezierCurveTo(80, 520, 300, 420, 520, 300); c.bezierCurveTo(740, 180, 990, 260, 990, 480); c.lineTo(990, 820); c.bezierCurveTo(990, 880, 920, 900, 860, 880); c.closePath(); }, "#e9b79a", 6);
  shape(c, () => { c.moveTo(150, 880); c.lineTo(150, 720); c.bezierCurveTo(150, 580, 330, 500, 520, 400); c.bezierCurveTo(710, 300, 920, 340, 920, 500); c.lineTo(920, 820); c.closePath(); }, "#7d4a3a", 5);
  for (const [x, y, r] of [[200, 700, 40], [310, 560, 44], [450, 470, 44], [600, 390, 42], [760, 370, 44], [880, 450, 40]]) shape(c, () => ell(c, x, y, r, r * 0.8), "#a7c957", 5);
  for (let i = 0; i < 6; i++) line(c, [[170 + i * 22, 870], [160 + i * 22, 800 - (i % 2) * 20]], 7);
  for (const [x, y] of [[300, 600], [470, 500], [620, 430], [200, 740]]) speck(c, x, y, 13, "#6b5a46");
  arrow(c, [[260, 1020], [300, 840], [520, 640], [720, 520]], RED, 16);
};
// term 13: enamel, a tooth cut in half
const termEnamel = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 990, 300, 30);
  const tooth = () => { c.moveTo(250, 380); c.bezierCurveTo(250, 160, 420, 200, 540, 260); c.bezierCurveTo(660, 200, 830, 160, 830, 380); c.bezierCurveTo(830, 560, 770, 600, 740, 780); c.bezierCurveTo(720, 960, 630, 960, 610, 780); c.bezierCurveTo(590, 640, 490, 640, 470, 780); c.bezierCurveTo(450, 960, 360, 960, 340, 780); c.bezierCurveTo(310, 600, 250, 560, 250, 380); c.closePath(); };
  shape(c, tooth, TOOTH, 8);
  c.save(); c.beginPath(); tooth(); c.clip();
  c.beginPath(); c.moveTo(290, 390); c.bezierCurveTo(290, 250, 420, 270, 540, 320); c.bezierCurveTo(660, 270, 790, 250, 790, 390); c.bezierCurveTo(790, 540, 740, 580, 700, 800); c.lineTo(660, 960); c.lineTo(420, 960); c.lineTo(380, 800); c.bezierCurveTo(340, 580, 290, 540, 290, 390); c.closePath();
  c.fillStyle = "#f0d9a0"; c.fill(); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
  shape(c, () => { c.moveTo(430, 440); c.quadraticCurveTo(540, 380, 650, 440); c.quadraticCurveTo(650, 600, 600, 720); c.lineTo(580, 880); c.lineTo(500, 880); c.lineTo(480, 720); c.quadraticCurveTo(430, 600, 430, 440); c.closePath(); }, PINK, 5);
  c.restore();
  shine(c, [[320, 330], [345, 450]], 14);
  arrow(c, [[160, 220], [260, 300]], RED, 14);
};
// term 14: milk teeth, a smile with a gap, and a small tooth
const termMilk = (c: Ctx) => {
  ground(c);
  face(c, 540, 450, 320, { mouth: "none" });
  c.beginPath(); c.moveTo(380, 620); c.quadraticCurveTo(540, 760, 700, 620); c.quadraticCurveTo(540, 660, 380, 620); c.closePath(); c.fillStyle = "#c4513f"; c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  c.save(); c.beginPath(); c.moveTo(380, 620); c.quadraticCurveTo(540, 760, 700, 620); c.quadraticCurveTo(540, 660, 380, 620); c.closePath(); c.clip();
  [0, 1, 3, 4].forEach((k) => shape(c, () => rrect(c, 392 + k * 62, 626, 56, 56, 10), TOOTH, 4));
  c.restore();
  // the small milk tooth that fell out
  shadow(c, 850, 950, 90, 18);
  shape(c, () => { c.moveTo(790, 950); c.bezierCurveTo(770, 860, 820, 850, 850, 875); c.bezierCurveTo(880, 850, 930, 860, 910, 950); c.closePath(); }, TOOTH, 5);
  arrow(c, [[590, 740], [700, 840]], RED, 12);
};
// term 15: fingerprint, the ridges, and the three kinds of pattern
const termPrint = (c: Ctx) => {
  ground(c);
  const tip = () => { c.moveTo(130, 920); c.lineTo(130, 330); c.bezierCurveTo(130, 130, 530, 130, 530, 330); c.lineTo(530, 920); c.closePath(); };
  shape(c, tip, SKIN.child, 6); shade(c, tip, SKIN.childDk, 40, 0, 0.5);
  c.save(); c.beginPath(); tip(); c.clip(); whorl(c, 330, 440, 190, "#6a4128", 8, 6); c.restore();
  const arch = () => { for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(-80, 60 + i * 24); c.quadraticCurveTo(0, -50 + i * 24, 80, 60 + i * 24); c.stroke(); } };
  const loop = () => { for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(-70 + i * 16, 90); c.lineTo(-70 + i * 16, -10 + i * 14); c.quadraticCurveTo(-5, -70 + i * 14, 70 - i * 16, -10 + i * 14); c.lineTo(70 - i * 16 - 30, 90); c.stroke(); } };
  const P: [number, number, () => void][] = [[820, 220, arch], [820, 540, loop]];
  P.forEach(([x, y, f]) => lens(c, x, y, 135, WHITE, () => { c.save(); c.translate(x, y - 40); c.strokeStyle = INK; c.lineWidth = 7; c.lineCap = "round"; f(); c.restore(); }));
  lens(c, 820, 860, 135, WHITE, () => whorl(c, 820, 860, 105, INK, 7, 4));
};

export const ic_bodyBodyPartsL3 = cards("sci.body.body-parts.L3 cards", [
intro,summary,flowE1,flowE2,flowE3,flowA1,flowA2,flowA3,flowA4,flowA5,flowA6,projP1,chalC1,chalC2,termOrgan,termExternal,termInternal,termSkin,termCell,termKeratin,termPores,termSweat,termLashes,termTears,termEarwax,termEardrum,termMucus,termEnamel,termMilk,termPrint,]);
