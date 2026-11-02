import type { Ctx } from "./core";
import type { Pose } from "./flatKit";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, plate, glass, hand, person, write, cards } from "./flatKit";

// USING MATERIALS L1 · the spoon test, the biscuit in the rain, mopping a spill, holding hands like
// paper, the little book, the bottle-cap spoon; then the terms a child can see. Same girl (child) and
// mother (adult) on every card.

const CARD = "#d8ab6c", CARDDK = "#a67a3e", NEWS = "#e2dfd6", NEWSDK = "#a9a59b", CURD = "#fbf7ee", TABLE = "#e9d2a6", WETCLOTH = "#9fb4c8", BISCUIT = "#e6b96b", BISCUITDK = "#c69a4d";
type Kind = "steel" | "card" | "news" | "wood" | "plastic";
const KC: Record<Kind, [string, string]> = { steel: [COL.steel, COL.steelDk], card: [CARD, CARDDK], news: [NEWS, NEWSDK], wood: [COL.wood, COL.woodDk], plastic: [COL.red, "#b53a26"] };
const KW: Record<Kind, [string, string]> = { steel: KC.steel, plastic: KC.plastic, wood: KC.wood, card: [CARDDK, "#6e4a1e"], news: [NEWSDK, "#6f6b63"] };

const table = (c: Ctx, y: number) => { c.fillStyle = TABLE; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };
const drop = (c: Ctx, x: number, y: number, r: number) => shape(c, () => { c.moveTo(x, y - r * 1.6); c.quadraticCurveTo(x + r, y - r * 0.3, x + r, y + r * 0.1); c.arc(x, y + r * 0.1, r, 0, Math.PI); c.quadraticCurveTo(x - r, y - r * 0.3, x, y - r * 1.6); c.closePath(); }, COL.water, 4);
const tick = (c: Ctx, x: number, y: number, s: number) => line(c, [[x - s, y], [x - s * 0.3, y + s * 0.7], [x + s, y - s * 0.8]], 14, COL.green);
const cross = (c: Ctx, x: number, y: number, s: number) => { line(c, [[x - s, y - s], [x + s, y + s]], 14, RED); line(c, [[x + s, y - s], [x - s, y + s]], 14, RED); };

// a spoon from its handle end (x, y) pointing along an; the scoop at the far end. Paper spoons are flat
// strips with a taped scoop; bend tilts the scoop (a soft spoon flops), wet darkens paper.
const spoon = (c: Ctx, x: number, y: number, len: number, an: number, kind: Kind, bend = 0, wet = false) => {
  const [col, dk] = wet ? KW[kind] : KC[kind], paper = kind === "card" || kind === "news";
  c.save(); c.translate(x, y); c.rotate(an);
  const hw = len * 0.05, hl = len * 0.58;
  const hp = () => rrect(c, 0, -hw, hl + len * 0.04, hw * 2, paper ? hw * 0.3 : hw);
  shape(c, hp, col); shade(c, hp, dk, -len * 0.02, -hw * 0.9);
  if (kind === "news") for (let i = 0; i < 6; i++) line(c, [[len * 0.06 + i * len * 0.085, -hw * 0.4], [len * 0.09 + i * len * 0.085, -hw * 0.4]], 3, "#8d8a82");
  if (paper) line(c, [[len * 0.03, hw * 0.3], [hl, hw * 0.3]], 2.5, dk);
  c.translate(hl, 0); c.rotate(bend);
  const bl = len * 0.42, br = len * 0.12;
  const bp = paper ? () => rrect(c, 0, -br, bl, br * 2, br * 0.5) : () => ell(c, bl * 0.5, 0, bl * 0.5, br);
  shape(c, bp, col); shade(c, bp, dk, -bl * 0.15, -br * 0.6);
  if (kind === "steel" || kind === "plastic") shine(c, [[bl * 0.2, -br * 0.45], [bl * 0.65, -br * 0.5]], 6);
  if (paper) shape(c, () => rrect(c, -hw * 0.5, -br * 0.75, hw * 1.6, br * 1.5, 4), "rgba(255,255,255,0.65)", 2);
  c.restore();
};
// arm angles so that a person's hand (side -1 left, 1 right) lands on (tx, ty); up = -1 puts the elbow low
const armTo = (x: number, y: number, h: number, side: -1 | 1, tx: number, ty: number, up: 1 | -1 = -1): [number, number] => {
  const sx = x + side * h * 0.11, sy = y - h * 0.74 + h * 0.03, l1 = h * 0.17, l2 = h * 0.16;
  let dx = tx - sx, dy = ty - sy, d = Math.hypot(dx, dy); const m = Math.min(d, l1 + l2 - 1); dx *= m / d; dy *= m / d; d = m;
  const th = Math.atan2(dy, dx), cosA = Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))), a1 = th - up * Math.acos(cosA);
  const ex = sx + Math.cos(a1) * l1, ey = sy + Math.sin(a1) * l1; return [a1, Math.atan2(sy + dy - ey, sx + dx - ex)];
};
const curdTop = (c: Ctx, x: number, y: number, r: number, col = CURD) => { c.globalAlpha = 0.85; shape(c, () => ell(c, x, y, r, r * 0.2), col, 0); c.globalAlpha = 1; };
const biscuit = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r * 0.8), BISCUIT, 5); shade(c, () => ell(c, x, y, r, r * 0.8), BISCUITDK, -r * 0.15, -r * 0.2); for (let i = 0; i < 6; i++) shape(c, () => ell(c, x - r * 0.4 + (i % 3) * r * 0.4, y - r * 0.2 + Math.floor(i / 3) * r * 0.4, r * 0.06, r * 0.06), BISCUITDK, 0); };

// ---------------------------------------------------------------- set-up cards: the spoon test
// 1. folding newspaper into a spoon: a strip with one end bent up into a scoop, tape, mother's hand
const s0 = (c: Ctx) => {
  ground(c); table(c, 260);
  c.save(); c.translate(560, 430); c.rotate(-0.06);
  shape(c, () => rrect(c, -330, -180, 660, 360, 8), NEWS, 5);
  shape(c, () => rrect(c, -290, -150, 250, 28, 4), "#8d8a82", 0);
  for (let i = 0; i < 6; i++) { line(c, [[-290, -90 + i * 40], [-30 + (i % 2) * 15, -90 + i * 40]], 4, "#a9a59b"); line(c, [[20, -140 + i * 40], [290 - (i % 3) * 25, -140 + i * 40]], 4, "#a9a59b"); }
  c.restore();
  shadow(c, 600, 815, 300, 30);
  const strip = () => rrect(c, 330, 715, 420, 90, 10);
  shape(c, strip, NEWS); shade(c, strip, NEWSDK, -14, -24);
  for (let i = 0; i < 3; i++) line(c, [[350, 738 + i * 22], [730, 738 + i * 22]], 2.5, NEWSDK);
  c.save(); c.translate(745, 760); c.rotate(-1.05);
  const sc = () => rrect(c, -20, -45, 210, 90, 10); shape(c, sc, NEWS); shade(c, sc, NEWSDK, -14, -24);
  for (let i = 0; i < 3; i++) line(c, [[0, -22 + i * 22], [180, -22 + i * 22]], 2.5, NEWSDK);
  shape(c, () => rrect(c, -40, -62, 60, 124, 6), "rgba(255,255,255,0.7)", 3);
  c.restore();
  arrow(c, [[930, 880], [990, 790], [940, 650]]);
  hand(c, 250, 760, 0, 1.7, SKIN.adult, CLOTH.adult);
};
// the girl behind the table, carrying water from the full bowl to the empty one
const carryScene = (c: Ctx, tool: (wx: number, wy: number) => void) => {
  ground(c);
  const pose: Pose = { armR: armTo(545, 820, 600, 1, 700, 560), armL: [Math.PI * 0.6, Math.PI * 0.5] };
  person(c, 545, 820, 600, pose);
  table(c, 700);
  bowl(c, 330, 690, 165, COL.water);
  bowl(c, 760, 690, 165, COL.sky);
  arrow(c, [[380, 560], [545, 470], [710, 560]]);
  tool(700, 560);
};
// 2. five scoops with the card spoon; the steel and newspaper spoons wait on the table
const s1 = (c: Ctx) => {
  carryScene(c, (wx, wy) => { spoon(c, wx, wy, 190, 0.55, "card"); drop(c, 835, 660, 9); drop(c, 862, 640, 7); });
  spoon(c, 90, 940, 320, 0, "steel"); spoon(c, 600, 980, 320, 0, "news");
};
// 3. three spoons standing in a bowl of water for three minutes
const s2 = (c: Ctx) => {
  ground(c); table(c, 420);
  shape(c, () => ell(c, 160, 160, 95, 95), WHITE, 6);
  for (let i = 0; i < 12; i++) line(c, [[160 + Math.cos(i * Math.PI / 6) * 78, 160 + Math.sin(i * Math.PI / 6) * 78], [160 + Math.cos(i * Math.PI / 6) * 86, 160 + Math.sin(i * Math.PI / 6) * 86]], 3);
  line(c, [[160, 160], [160, 100]], 6); line(c, [[160, 160], [206, 190]], 6, RED);
  write(c, "3", 275, 110, 100, INK, 9);
  bowl(c, 540, 620, 300, COL.water);
  spoon(c, 230, 190, 470, 1.0, "steel"); spoon(c, 540, 140, 470, Math.PI / 2, "card"); spoon(c, 860, 200, 480, 2.1, "news");
  c.globalAlpha = 0.7; shape(c, () => ell(c, 540, 620, 300, 60), COL.water, 0); c.globalAlpha = 1;
};
// 4. the soft card spoon flops in the curd; the steel spoon stands straight
const s3 = (c: Ctx) => {
  ground(c); table(c, 500);
  bowl(c, 310, 700, 175, CURD); bowl(c, 770, 700, 175, CURD);
  spoon(c, 770, 330, 400, Math.PI / 2, "steel"); curdTop(c, 770, 700, 175);
  spoon(c, 330, 448, 330, Math.PI / 2, "card", 1.3, true);
  hand(c, 330, 420, Math.PI / 2, 1.4);
  arrow(c, [[470, 290], [470, 420]]);
};

// ---------------------------------------------------------------- card pictures
// flow.e1: after the bath, in the curd: steel stands, card bends, newspaper folds
const flowE1 = (c: Ctx) => {
  ground(c); table(c, 420);
  bowl(c, 520, 680, 340, CURD);
  spoon(c, 260, 180, 440, Math.PI / 2, "steel");
  spoon(c, 600, 300, 440, Math.PI / 2, "card", 1.3, true);
  spoon(c, 820, 300, 380, Math.PI / 2, "news", -1.3, true);
  curdTop(c, 520, 680, 340);
  tick(c, 260, 120, 34); cross(c, 600, 150, 30); cross(c, 820, 150, 30);
};
// flow.a1: four biscuits on the plate in three coats and none; the girl makes it rain with her fingers
const flowA1 = (c: Ctx) => {
  ground(c); table(c, 420);
  glass(c, 960, 430, 110, 170, 0.7);
  plate(c, 540, 700, 430, 190);
  // plastic coat: biscuit under a shiny clear sheet
  biscuit(c, 300, 660, 75); shape(c, () => rrect(c, 205, 585, 190, 150, 20), "rgba(191,224,245,0.6)", 5); shine(c, [[240, 620], [300, 605]], 8);
  // paper napkin: a white folded square
  shape(c, () => rrect(c, 410, 670, 180, 140, 12), COL.paper, 5); line(c, [[430, 690], [570, 790]], 3, COL.grey);
  // cotton hanky: a checked cloth
  shape(c, () => rrect(c, 610, 580, 180, 140, 14), COL.pink, 5); for (let i = 1; i < 4; i++) { line(c, [[610 + i * 45, 585], [610 + i * 45, 715]], 3, COL.red); line(c, [[615, 580 + i * 35], [785, 580 + i * 35]], 3, COL.red); }
  biscuit(c, 900, 740, 75);
  hand(c, 640, 170, Math.PI * 0.6, 1.5, SKIN.child, CLOTH.child, true);
  [[420, 380], [560, 420], [700, 360], [830, 440], [330, 500], [620, 520], [900, 560], [760, 500]].forEach(([x, y]) => drop(c, x, y, 11));
};
// flow.a2: pressing the cotton cloth on the spill; the four pieces wait at the back
const flowA2 = (c: Ctx) => {
  ground(c); table(c, 380);
  const sq = (x: number, fill: string, draw?: () => void) => { shape(c, () => polyP(c, [[x + 15, 400], [x + 165, 400], [x + 150, 510], [x, 510]]), fill, 5); draw?.(); };
  sq(100, "rgba(191,224,245,0.7)", () => shine(c, [[130, 430], [170, 420]], 7));
  sq(340, COL.steel, () => shine(c, [[370, 440], [430, 470]], 7));
  sq(580, NEWS, () => { for (let i = 0; i < 4; i++) line(c, [[610, 425 + i * 22], [700, 425 + i * 22]], 3, "#9a968c"); });
  sq(820, COL.cloth, () => { for (let i = 1; i < 3; i++) { line(c, [[830 + i * 50, 405], [820 + i * 50, 505]], 3, COL.red); line(c, [[840, 400 + i * 36], [975, 400 + i * 36]], 3, COL.red); } });
  plate(c, 520, 800, 400, 170);
  shape(c, () => ell(c, 540, 810, 180, 60), COL.water, 4);
  const cl = () => rrect(c, 410, 715, 220, 150, 16);
  shape(c, cl, COL.cloth, 5);
  c.save(); c.beginPath(); cl(); c.clip(); shape(c, () => ell(c, 520, 850, 140, 60), WETCLOTH, 0); c.restore();
  hand(c, 470, 640, Math.PI / 2, 1.6, SKIN.child, CLOTH.child, true);
  arrow(c, [[700, 560], [700, 690]]);
};
// flow.a3: mother and girl holding hands tightly like dry paper fibres, water drops coming
const flowA3 = (c: Ctx) => {
  ground(c); table(c, 980);
  const M: [number, number] = [548, 625];
  person(c, 330, 980, 760, { adult: true, armR: armTo(330, 980, 760, 1, M[0], M[1]) });
  person(c, 760, 980, 580, { armL: armTo(760, 980, 580, -1, M[0], M[1]) });
  shape(c, () => ell(c, M[0], M[1], 36, 30), SKIN.child, 5);
  [[120, 140], [260, 90], [430, 160], [560, 80], [700, 150], [860, 100], [980, 180], [160, 330], [600, 300], [950, 360], [500, 460], [920, 520]].forEach(([x, y]) => drop(c, x, y, 14));
};
// flow.p1: the little book open: a steel spoon and a bowl of rice drawn on one page, the crayon on the other
const flowP1 = (c: Ctx) => {
  ground(c); table(c, 300);
  shadow(c, 560, 900, 420, 36);
  shape(c, () => polyP(c, [[140, 420], [530, 380], [530, 860], [140, 900]]), COL.paper);
  shape(c, () => polyP(c, [[550, 380], [940, 420], [940, 900], [550, 860]]), COL.paper);
  line(c, [[540, 380], [540, 860]], 6);
  bowl(c, 335, 600, 95, COL.steelIn);
  shape(c, () => { c.moveTo(250, 598); c.bezierCurveTo(280, 520, 390, 520, 420, 598); c.closePath(); }, WHITE, 5);
  for (let i = 0; i < 7; i++) shape(c, () => ell(c, 270 + i * 22, 570 + (i % 2) * 14, 7, 5), WHITE, 3);
  spoon(c, 200, 780, 230, -0.35, "steel");
  c.save(); c.translate(870, 460); c.rotate(2.3);
  shape(c, () => rrect(c, 0, -22, 230, 44, 8), COL.orange); shape(c, () => polyP(c, [[230, -22], [270, 0], [230, 22]]), COL.orange, 5);
  shape(c, () => rrect(c, 40, -22, 150, 44, 0), "#f7e3c4", 3);
  c.restore();
  hand(c, 880, 440, 2.3, 1.3);
};
// flow.c1: the bottle-cap spoon on an ice-cream stick carries water across
const flowC1 = (c: Ctx) => {
  carryScene(c, (wx, wy) => {
    c.save(); c.translate(wx, wy); c.rotate(0.55);
    shape(c, () => rrect(c, 0, -14, 190, 28, 14), COL.wood); shade(c, () => rrect(c, 0, -14, 190, 28, 14), COL.woodDk, -6, -12);
    shape(c, () => rrect(c, 140, -24, 30, 48, 6), "rgba(255,255,255,0.7)", 3);
    shape(c, () => rrect(c, 160, -44, 60, 88, 8), COL.blue); shade(c, () => rrect(c, 160, -44, 60, 88, 8), COL.blueDk, -8, -14);
    shape(c, () => ell(c, 190, -44, 30, 10), COL.water, 5);
    c.restore();
    drop(c, 880, 660, 9);
  });
  write(c, "5", 90, 90, 130, INK, 10);
};
// term.0 Material: a steel spoon, a wooden spoon and a red plastic spoon
const term0 = (c: Ctx) => {
  ground(c); table(c, 300);
  [[250, "steel"], [540, "wood"], [830, "plastic"]].forEach(([x, k]) => { shadow(c, (x as number) + 40, 905, 70, 18); spoon(c, x as number, 900, 600, -Math.PI / 2, k as Kind); });
};
// term.2 Waterproof: rain running down the yellow raincoat, the girl dry inside
const term2 = (c: Ctx) => {
  ground(c, COL.sky); table(c, 1000);
  const x = 540, y = 1000, h = 740, sh = y - h * 0.74, hip = y - h * 0.42, head = h * 0.13, hy = sh - head * 1.05;
  person(c, x, y, h, {});
  const coat = () => polyP(c, [[x - h * 0.2, sh - h * 0.02], [x + h * 0.2, sh - h * 0.02], [x + h * 0.3, hip + h * 0.1], [x - h * 0.3, hip + h * 0.1]]);
  shape(c, coat, COL.yellow); shade(c, coat, "#e0b020", -h * 0.06, -h * 0.03);
  line(c, [[x, sh + h * 0.02], [x, hip + h * 0.08]], 4, "#e0b020");
  shape(c, () => ell(c, x, hy - head * 0.1, head * 1.4, head * 1.45), COL.yellow);
  shape(c, () => ell(c, x, hy, head, head * 1.05), SKIN.child);
  shape(c, () => { c.moveTo(x - head * 0.9, hy - head * 0.35); c.quadraticCurveTo(x, hy - head * 1.0, x + head * 0.9, hy - head * 0.35); c.quadraticCurveTo(x, hy - head * 0.5, x - head * 0.9, hy - head * 0.35); c.closePath(); }, CLOTH.hair, 4);
  shape(c, () => ell(c, x - head * 0.35, hy + head * 0.12, head * 0.09, head * 0.12), INK, 0); shape(c, () => ell(c, x + head * 0.35, hy + head * 0.12, head * 0.09, head * 0.12), INK, 0);
  c.beginPath(); c.arc(x, hy + head * 0.38, head * 0.3, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  // rain, and drops running off the coat
  [[90, 120], [230, 60], [380, 140], [720, 70], [880, 150], [1000, 60], [120, 420], [980, 400], [80, 700], [1010, 720], [250, 560], [850, 580]].forEach(([px, py]) => drop(c, px, py, 13));
  [[x - 60, sh + 120], [x + 90, sh + 200], [x - 110, hip - 20], [x + 40, hip + 40]].forEach(([px, py]) => { line(c, [[px, py - 60], [px, py - 14]], 5, COL.waterDk); drop(c, px, py, 10); });
  shape(c, () => ell(c, x, 1030, 260, 28), COL.water, 4);
};
// term.3 Absorb: a cotton towel drying the girl's wet hands, dark where it is wet
const term3 = (c: Ctx) => {
  ground(c); table(c, 1000);
  hand(c, 360, 860, -Math.PI / 2 - 0.15, 2.0, SKIN.child, CLOTH.child, true);
  hand(c, 720, 860, -Math.PI / 2 + 0.15, 2.0, SKIN.child, CLOTH.child, true);
  const tw = () => rrect(c, 230, 340, 620, 330, 36);
  shape(c, tw, COL.cloth);
  c.save(); c.beginPath(); tw(); c.clip();
  shape(c, () => ell(c, 450, 560, 170, 110), WETCLOTH, 0); shape(c, () => ell(c, 650, 520, 130, 100), WETCLOTH, 0);
  for (let i = 0; i < 5; i++) line(c, [[240, 370 + i * 62], [840, 370 + i * 62]], 3, "#dcd4c2");
  c.restore(); shape(c, tw, "rgba(0,0,0,0)", 6);
  [[300, 260], [560, 280], [800, 250]].forEach(([x, y]) => drop(c, x, y, 13));
  arrow(c, [[560, 150], [560, 300]]);
};
// term.4 Stiff: a steel spoon standing straight in thick curd
const term4 = (c: Ctx) => {
  ground(c); table(c, 460);
  bowl(c, 540, 700, 320, CURD);
  spoon(c, 560, 180, 520, Math.PI / 2 - 0.12, "steel");
  curdTop(c, 540, 700, 320);
};

export const ic_materialsUsingMaterialsL1 = cards("sci.materials.using-materials.L1", [s0, s1, s2, s3, flowE1, flowA1, flowA2, flowA3, flowP1, flowC1, term0, term2, term3, term4]);
