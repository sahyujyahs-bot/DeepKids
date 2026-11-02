import type { Ctx } from "./core";
import { cards, ground, shape, shade, shadow, ell, rrect, polyP, line, arrow, write, shine, glass, plate, person, hand, D, INK, WHITE, RED, COL, SKIN, CLOTH } from "./flatKit";

// ME AND OTHERS L1 · flat set-up cards and card pictures. Same child (orange, side bun) and same
// grown-up (Amma, blue) on every card; Paati (purple, grey hair, glasses) and Appa (green, moustache)
// join for the family tasting. Foods: jaggery lumps, lime wedges, karela slices.

const TABLE = "#d9b26a", TABLE_DK = "#b98f45", FLOOR = "#d8cdb6";
const tableBand = (c: Ctx, y: number) => { c.fillStyle = TABLE; c.fillRect(0, y, D, D - y); c.fillStyle = TABLE_DK; c.fillRect(0, y, D, 18); line(c, [[0, y], [D, y]], 6); };

// ---------------------------------------------------------------- a person from the waist up
type Face = { adult?: boolean; cloth?: string; clothDk?: string; eyes?: "open" | "closed" | "wide"; mouth?: "smile" | "frown" | "o" | "flat" | "tongue" | "big" | "chew"; brows?: "up" | "down" | "flat"; hair?: "bun" | "short" | "curly" | "long"; grey?: boolean; glasses?: boolean; moustache?: boolean; blind?: boolean; tilt?: number };
// (x, y) is the bottom centre of the torso; at s = 1 the head is 190 wide and its centre sits 290 above y
const bust = (c: Ctx, x: number, y: number, s: number, o: Face = {}) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  const ad = !!o.adult, skin = ad ? SKIN.adult : SKIN.child, cloth = o.cloth ?? (ad ? CLOTH.adult : CLOTH.child), clothDk = o.clothDk ?? (ad ? CLOTH.adultDk : CLOTH.childDk);
  const hairCol = o.grey ? "#b8b4ae" : CLOTH.hair, hair = o.hair ?? (ad ? "short" : "bun");
  const torso = () => { c.moveTo(-150, 0); c.lineTo(-150, -110); c.quadraticCurveTo(-150, -170, -80, -170); c.lineTo(80, -170); c.quadraticCurveTo(150, -170, 150, -110); c.lineTo(150, 0); c.closePath(); };
  shape(c, torso, cloth); shade(c, torso, clothDk, 40, 0);
  shape(c, () => rrect(c, -28, -215, 56, 60, 10), skin, 5);
  c.save(); c.translate(0, -290); c.rotate(o.tilt ?? 0);
  if (hair === "long") { shape(c, () => rrect(c, -118, -40, 48, 180, 20), hairCol, 5); shape(c, () => rrect(c, 70, -40, 48, 180, 20), hairCol, 5); }
  shape(c, () => ell(c, 0, 0, 95, 100), skin);
  shape(c, () => { c.moveTo(-97, -5); c.bezierCurveTo(-95, -150, 95, -150, 97, -5); c.quadraticCurveTo(0, -55, -97, -5); c.closePath(); }, hairCol, 5);
  if (hair === "bun") shape(c, () => ell(c, 92, -20, 30, 52), hairCol, 4);
  if (hair === "curly") for (let i = 0; i < 8; i++) { const a = Math.PI * 1.02 + (i / 7) * Math.PI * 0.96; shape(c, () => ell(c, Math.cos(a) * 92, -8 + Math.sin(a) * 95, 24, 24), hairCol, 4); }
  // ears
  shape(c, () => ell(c, -98, 12, 14, 20), skin, 5); shape(c, () => ell(c, 98, 12, 14, 20), skin, 5);
  // eyes
  const ey = 8;
  for (const sx of [-35, 35]) {
    if (o.eyes === "closed") { c.beginPath(); c.arc(sx, ey + 6, 14, Math.PI + 0.25, Math.PI * 2 - 0.25); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); }
    else if (o.eyes === "wide") { shape(c, () => ell(c, sx, ey, 20, 24), WHITE, 4); shape(c, () => ell(c, sx, ey + 2, 11, 14), INK, 0); }
    else shape(c, () => ell(c, sx, ey, 9, 12), INK, 0);
    if (o.brows === "up") line(c, [[sx - 18, ey - 36], [sx, ey - 48], [sx + 18, ey - 36]], 5);
    else if (o.brows === "down") line(c, [[sx - 18, ey - 28 - (sx < 0 ? 8 : 0)], [sx + 18, ey - 28 - (sx > 0 ? 8 : 0)]], 5);
    else line(c, [[sx - 16, ey - 28], [sx + 16, ey - 28]], 4);
  }
  if (o.glasses) { for (const sx of [-35, 35]) { c.beginPath(); c.arc(sx, ey + 2, 26, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); } line(c, [[-9, ey], [9, ey]], 5); }
  // nose
  line(c, [[3, 14], [11, 34], [-3, 36]], 3.5);
  if (o.moustache) shape(c, () => { c.moveTo(-26, 46); c.quadraticCurveTo(0, 36, 26, 46); c.quadraticCurveTo(0, 56, -26, 46); c.closePath(); }, CLOTH.hair, 3);
  // mouth
  const m = o.mouth ?? "smile", my = 50;
  if (m === "smile") { c.beginPath(); c.arc(0, my - 8, 30, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); }
  else if (m === "frown") { c.beginPath(); c.arc(0, my + 30, 30, Math.PI + 0.25, Math.PI * 2 - 0.25); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); }
  else if (m === "o") shape(c, () => ell(c, 0, my + 6, 15, 20), "#5a2a3a", 4);
  else if (m === "chew") shape(c, () => ell(c, 0, my + 4, 14, 8), "#5a2a3a", 4);
  else if (m === "flat") line(c, [[-22, my + 2], [22, my + 2]], 5);
  else if (m === "big") { shape(c, () => { c.moveTo(-38, my - 6); c.quadraticCurveTo(0, my + 60, 38, my - 6); c.closePath(); }, "#5a2a3a", 4); shape(c, () => { c.moveTo(-30, my - 2); c.lineTo(30, my - 2); c.lineTo(26, my + 10); c.lineTo(-26, my + 10); c.closePath(); }, WHITE, 0); }
  else if (m === "tongue") { shape(c, () => ell(c, 0, my + 6, 36, 28), "#5a2a3a", 4); shape(c, () => rrect(c, -22, my + 2, 44, 62, 20), COL.pink, 4); line(c, [[0, my + 16], [0, my + 50]], 3, "#d57a95"); }
  if (o.blind) { shape(c, () => rrect(c, -108, ey - 20, 216, 40, 10), COL.pink, 5); shape(c, () => polyP(c, [[100, ey - 8], [150, ey - 30], [140, ey + 2]]), COL.pink, 4); shape(c, () => polyP(c, [[100, ey + 8], [150, ey + 36], [136, ey]]), COL.pink, 4); }
  c.restore(); c.restore();
};
// an arm from a shoulder to a pointing finger
const pointArm = (c: Ctx, from: number[], to: number[], skin: string, cloth: string, w = 34) => {
  line(c, [from, to], w + 10, INK); line(c, [from, to], w, cloth);
  shape(c, () => ell(c, to[0], to[1], w * 0.62, w * 0.62), skin, 5);
  const an = Math.atan2(to[1] - from[1], to[0] - from[0]);
  c.save(); c.translate(to[0], to[1]); c.rotate(an); shape(c, () => rrect(c, 0, -w * 0.22, w * 1.1, w * 0.44, w * 0.22), skin, 5); c.restore();
};
// a fist with the thumb out: rot 0 = up, PI/2 = sideways, PI = down
const thumb = (c: Ctx, x: number, y: number, rot: number, s: number, skin: string, dk: string) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  shape(c, () => rrect(c, -55, -30, 110, 110, 28), skin, 6);
  for (let k = 0; k < 4; k++) shape(c, () => rrect(c, 6, -30 + k * 27, 50, 25, 12), skin, 5);
  line(c, [[-40, 60], [0, 66]], 3, dk);
  shape(c, () => rrect(c, -48, -100, 44, 92, 22), skin, 6);
  c.restore();
};
// an open hand, palm towards us, five fingers
const palm = (c: Ctx, x: number, y: number, s: number, skin: string, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  const hs = [68, 86, 80, 60];
  for (let k = 0; k < 4; k++) { const xk = -40 + k * 27, h = hs[k]; shape(c, () => rrect(c, xk - 12, -40 - h, 24, h + 40, 12), skin, 5); }
  c.save(); c.translate(-50, -10); c.rotate(0.8); shape(c, () => rrect(c, -13, -70, 26, 80, 13), skin, 5); c.restore();
  shape(c, () => rrect(c, -52, -40, 104, 110, 30), skin, 6);
  c.restore();
};
const soundArcs = (c: Ctx, x: number, y: number, dir: number, n = 3, w = 7, col = INK) => { for (let i = 1; i <= n; i++) { c.beginPath(); c.arc(x, y, 30 * i + 10, dir - 0.55, dir + 0.55); c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.stroke(); } };

// ---------------------------------------------------------------- foods
const jaggery = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.15, y + r * 0.8, r * 0.95, r * 0.25);
  const p = () => polyP(c, [[x - r, y + r * 0.3], [x - r * 0.8, y - r * 0.5], [x - r * 0.2, y - r * 0.9], [x + r * 0.6, y - r * 0.7], [x + r, y], [x + r * 0.7, y + r * 0.6], [x, y + r * 0.75]]);
  shape(c, p, "#c98a3a", Math.max(3, r * 0.08)); shade(c, p, "#9a6022", r * 0.35, r * 0.2); shine(c, [[x - r * 0.6, y - r * 0.25], [x - r * 0.3, y - r * 0.6]], Math.max(3, r * 0.12));
};
const limeWedge = (c: Ctx, x: number, y: number, r: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  const sect = () => { c.moveTo(0, 0); c.arc(0, 0, r, -Math.PI * 0.5 - 0.6, -Math.PI * 0.5 + 0.6); c.closePath(); };
  shape(c, sect, "#dcf08f", Math.max(3, r * 0.06));
  c.beginPath(); c.arc(0, 0, r - r * 0.1, -Math.PI * 0.5 - 0.57, -Math.PI * 0.5 + 0.57); c.strokeStyle = COL.green; c.lineWidth = r * 0.18; c.lineCap = "butt"; c.stroke();
  for (const a of [-0.4, -0.13, 0.13, 0.4]) line(c, [[0, 0], [Math.cos(-Math.PI / 2 + a) * (r - r * 0.22), Math.sin(-Math.PI / 2 + a) * (r - r * 0.22)]], Math.max(2, r * 0.04), "#a9c95a");
  c.restore();
};
const limeHalf = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.1, y + r * 0.95, r * 0.9, r * 0.2);
  shape(c, () => ell(c, x, y, r, r), COL.green, 5); shape(c, () => ell(c, x, y, r * 0.82, r * 0.82), "#dcf08f", 4);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; line(c, [[x, y], [x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78]], 3, "#a9c95a"); }
};
const karela = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.1, y + r * 0.95, r * 0.9, r * 0.2);
  const p = () => { for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2, rr = r * (i % 2 ? 1 : 0.9); i ? c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : c.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); };
  shape(c, p, COL.green, Math.max(3, r * 0.07)); shade(c, p, COL.greenDk, r * 0.3, r * 0.2);
  shape(c, () => ell(c, x, y, r * 0.58, r * 0.58), "#eef5d8", 4);
  for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2 + 0.4; shape(c, () => ell(c, x + Math.cos(a) * r * 0.33, y + Math.sin(a) * r * 0.33, r * 0.14, r * 0.09, a), "#f7e9b0", 2.5); }
};
const foodsOnPlate = (c: Ctx, x: number, y: number, kind: number, s: number) => {
  if (kind === 0) [[-60, -10], [20, -25], [55, 15], [-15, 25]].forEach(([dx, dy]) => jaggery(c, x + dx * s, y + dy * s, 30 * s));
  if (kind === 1) [[-60, 20, 0.5], [0, 10, -0.3], [60, 24, 0.9], [-10, 40, 1.8]].forEach(([dx, dy, rt]) => limeWedge(c, x + dx * s, y + dy * s, 62 * s, rt));
  if (kind === 2) [[-60, -5], [25, -20], [60, 25], [-20, 30]].forEach(([dx, dy]) => karela(c, x + dx * s, y + dy * s, 34 * s));
};
const paper = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0) => { c.save(); c.translate(x, y); c.rotate(rot); shadow(c, w * 0.52, h * 0.52, w * 0.52, h * 0.52); shape(c, () => rrect(c, 0, 0, w, h, 12), COL.paper, 5); c.restore(); };
const crayon = (c: Ctx, x: number, y: number, an: number, len: number, col: string) => { c.save(); c.translate(x, y); c.rotate(an); shape(c, () => rrect(c, -len / 2, -14, len, 28, 6), col, 5); shape(c, () => polyP(c, [[len / 2, -14], [len / 2 + 30, 0], [len / 2, 14]]), col, 5); c.restore(); };

// ================================================================ set-up cards
// setup.e1.0 · three plates: jaggery, lime wedges, karela slices; glasses of water beside
const se1a = (c: Ctx) => {
  ground(c, TABLE);
  [260, 450, 640, 830].forEach((x) => glass(c, x, 400, 95, 160, 0.6));
  [[210, 0], [540, 1], [870, 2]].forEach(([x, k]) => { plate(c, x, 600, 160, 75); foodsOnPlate(c, x, 585, k, 1.0); });
};
// setup.e1.1 · the family of four, eyes closed, chewing
const family = (c: Ctx, y: number, s: number, eyes: "open" | "closed", mouths: Face["mouth"][]) => {
  bust(c, 165, y, s, { eyes, mouth: mouths[0] });
  bust(c, 415, y, s, { adult: true, eyes, mouth: mouths[1], hair: "long" });
  bust(c, 665, y, s, { adult: true, eyes, mouth: mouths[2], cloth: COL.purple, clothDk: "#6a4fa3", grey: true, glasses: true, hair: "long" });
  bust(c, 915, y, s, { adult: true, eyes, mouth: mouths[3], cloth: COL.green, clothDk: COL.greenDk, moustache: true });
};
const se1b = (c: Ctx) => {
  ground(c);
  family(c, 740, 0.8, "closed", ["chew", "chew", "chew", "chew"]);
  tableBand(c, 720);
  [[300, 0], [540, 1], [780, 2]].forEach(([x, k]) => { plate(c, x, 880, 110, 50); foodsOnPlate(c, x, 870, k, 0.62); });
};
// setup.e1.2 · thumbs up, sideways, down at the same moment; the table on paper
const miniThumb = (c: Ctx, x: number, y: number, rot: number, skin: string) => thumb(c, x, y, rot, 0.17, skin, skin);
const se1c = (c: Ctx) => {
  ground(c);
  family(c, 740, 0.72, "open", ["frown", "smile", "smile", "flat"]);
  const dirs = [Math.PI, 0, 0, Math.PI / 2], skins = [SKIN.child, SKIN.adult, SKIN.adult, SKIN.adult];
  [165, 415, 665, 915].forEach((x, i) => thumb(c, x + 104, 560, dirs[i], 0.62, skins[i], skins[i] === SKIN.child ? SKIN.childDk : SKIN.adultDk));
  tableBand(c, 720);
  paper(c, 210, 745, 660, 300);
  // grid: 3 food columns, 4 person rows
  for (let i = 0; i <= 4; i++) line(c, [[230, 765 + i * 56], [850, 765 + i * 56]], 3, COL.greyDk);
  for (let j = 0; j <= 3; j++) line(c, [[395 + j * 152, 765], [395 + j * 152, 989]], 3, COL.greyDk);
  jaggery(c, 470, 738, 16); limeWedge(c, 622, 752, 30); karela(c, 775, 738, 17);
  const rows: number[][] = [[0, Math.PI / 2, Math.PI], [0, 0, Math.PI / 2], [0, Math.PI, 0], [0, Math.PI / 2, Math.PI / 2]];
  rows.forEach((r, i) => r.forEach((rot, j) => miniThumb(c, 471 + j * 152, 785 + i * 56, rot, i ? SKIN.adult : SKIN.child)));
  [[0, 330, 793], [1, 330, 849], [2, 330, 905], [3, 330, 961]].forEach(([i, x, y]) => shape(c, () => ell(c, x, y, 16, 17), i ? SKIN.adult : SKIN.child, 4));
  crayon(c, 950, 900, -2.0, 120, COL.grey);
  hand(c, 1010, 980, -2.0, 0.9);
};
// setup.e2.0 · child on a chair, dupatta over the eyes; three family members across the room
const se2a = (c: Ctx) => {
  ground(c, "#f3ebdb"); c.fillStyle = FLOOR; c.fillRect(0, 760, D, D - 760); line(c, [[0, 760], [D, 760]], 5);
  // chair: back, seat, legs; the child sits on it, feet on the floor
  const H = 560, px = 780, py = 985, hip = py - 0.06 * H;
  shadow(c, px + 40, 1010, 190, 24);
  shape(c, () => rrect(c, px - 120, hip - 300, 40, 320, 10), COL.brown, 5);
  shape(c, () => rrect(c, px - 125, hip - 310, 160, 34, 10), COL.brown, 5);
  for (const lx of [px - 110, px + 30]) shape(c, () => rrect(c, lx, hip + 10, 28, 1000 - hip - 10, 8), COL.brown, 5);
  shape(c, () => rrect(c, px - 130, hip - 4, 200, 40, 10), COL.wood, 5);
  person(c, px, py, H, { sit: true, armL: [Math.PI * 0.6, Math.PI * 0.35], armR: [Math.PI * 0.5, Math.PI * 0.4] });
  const hy = py - 0.5165 * H, hr = 0.13 * H;
  shape(c, () => rrect(c, px - hr * 1.08, hy + hr * 0.12 - 24, hr * 2.16, 48, 12), COL.pink, 5);
  shape(c, () => polyP(c, [[px + hr * 1.05, hy - 2], [px + hr * 1.75, hy - 40], [px + hr * 1.65, hy + 10]]), COL.pink, 4);
  // three speakers across the room
  person(c, 130, 985, 600, { adult: true, armL: [Math.PI * 0.6, Math.PI * 0.55], armR: [Math.PI * 0.4, Math.PI * 0.45] });
  person(c, 330, 985, 540, { adult: true, armL: [Math.PI * 0.6, Math.PI * 0.55], armR: [Math.PI * 0.35, Math.PI * 0.4] });
  person(c, 490, 985, 420, { armL: [Math.PI * 0.6, Math.PI * 0.55], armR: [Math.PI * 0.4, Math.PI * 0.45] });
  soundArcs(c, 400, 985 - 0.74 * 540 - 0.13 * 540 * 0.75, 0, 3, 8);
  arrow(c, [[520, 400], [620, 440]]);
};
// setup.e2.1 · Amma whispers from across the room; the child tilts an ear to listen
const se2b = (c: Ctx) => {
  ground(c, "#f3ebdb"); c.fillStyle = FLOOR; c.fillRect(0, 860, D, D - 860); line(c, [[0, 860], [D, 860]], 5);
  bust(c, 250, 880, 1.1, { adult: true, hair: "long", mouth: "o", eyes: "open" });
  // the hand cupped beside the mouth
  line(c, [[330, 800], [370, 650]], 44, INK); line(c, [[330, 800], [370, 650]], 34, CLOTH.adult);
  shape(c, () => ell(c, 372, 628, 36, 52, 0.3), SKIN.adult, 5);
  // a whisper: small dotted arcs
  c.setLineDash([10, 14]); soundArcs(c, 395, 590, 0, 3, 5, COL.greyDk); c.setLineDash([]);
  bust(c, 800, 880, 1.1, { eyes: "open", mouth: "smile", tilt: -0.28 });
  line(c, [[720, 800], [690, 610]], 42, INK); line(c, [[720, 800], [690, 610]], 32, CLOTH.child);
  shape(c, () => ell(c, 686, 585, 34, 48, -0.4), SKIN.child, 5);
};

// ================================================================ card pictures
// flow.e2 · who said hello? eyes covered, a voice from the side
const fe2 = (c: Ctx) => {
  ground(c, "#f3ebdb");
  bust(c, 180, 1000, 0.95, { adult: true, hair: "long", mouth: "o" });
  soundArcs(c, 270, 720, 0, 3, 9);
  arrow(c, [[400, 640], [470, 560]]);
  bust(c, 660, 1000, 1.55, { blind: true, mouth: "smile" });
};
// flow.a1 · mirror twins: both pointing at their own eyes
const fa1 = (c: Ctx) => {
  ground(c, "#f3ebdb");
  shadow(c, 560, 920, 400, 30);
  shape(c, () => rrect(c, 170, 90, 740, 820, 40), COL.wood, 6); shade(c, () => rrect(c, 170, 90, 740, 820, 40), COL.woodDk, 20, 20, 0.5);
  shape(c, () => rrect(c, 210, 130, 660, 740, 28), COL.sky, 5);
  c.save(); c.beginPath(); rrect(c, 210, 130, 660, 740, 28); c.clip();
  bust(c, 400, 900, 1.05, { adult: true, hair: "long" });
  bust(c, 690, 900, 0.85);
  pointArm(c, [320, 790], [362, 610], SKIN.adult, CLOTH.adult, 34);
  pointArm(c, [770, 810], [720, 660], SKIN.child, CLOTH.child, 28);
  shine(c, [[250, 800], [260, 300]], 12);
  c.restore();
};
// flow.a2 · all about me: a face drawn on paper, a hand mirror, a crayon in hand
const fa2 = (c: Ctx) => {
  ground(c, TABLE);
  paper(c, 290, 170, 560, 740, -0.04);
  c.save(); c.translate(290, 170); c.rotate(-0.04);
  // a child's crayon drawing of their own face
  c.globalAlpha = 0.9;
  const r = 150, cx = 280, cy = 330;
  c.beginPath(); for (let i = 0; i <= 40; i++) { const a = (i / 40) * Math.PI * 2, rr = r + Math.sin(a * 5) * 6; i ? c.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr) : c.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } c.strokeStyle = COL.orange; c.lineWidth = 9; c.lineJoin = "round"; c.stroke();
  for (let i = 0; i < 9; i++) line(c, [[cx - 120 + i * 30, cy - 120], [cx - 130 + i * 30, cy - 200 + (i % 2) * 20]], 8, COL.black);
  shape(c, () => ell(c, cx - 55, cy - 10, 16, 20), COL.black, 0); shape(c, () => ell(c, cx + 55, cy - 10, 16, 20), COL.black, 0);
  line(c, [[cx - 60, cy + 55], [cx - 20, cy + 95], [cx + 30, cy + 95], [cx + 65, cy + 50]], 8, COL.red);
  line(c, [[cx + 5, cy + 10], [cx + 20, cy + 40], [cx - 5, cy + 42]], 6, COL.orange);
  c.globalAlpha = 1; c.restore();
  // hand mirror lying at the left
  shadow(c, 190, 640, 100, 30);
  shape(c, () => rrect(c, 160, 600, 60, 260, 20), COL.purple, 5);
  shape(c, () => ell(c, 190, 520, 108, 108), COL.purple, 6); shape(c, () => ell(c, 190, 520, 84, 84), COL.sky, 4);
  c.save(); c.beginPath(); ell(c, 190, 520, 84, 84); c.clip(); bust(c, 190, 760, 0.62, { mouth: "smile" }); c.restore();
  shine(c, [[130, 490], [160, 450]], 8);
  // the crayon in the child's hand
  crayon(c, 760 + Math.cos(-2.4) * 60, 840 + Math.sin(-2.4) * 60, -2.4, 170, COL.orange);
  hand(c, 820, 900, -2.4, 1.15);
};
// flow.a3 · favourite fruit tally: asking on the phone, the tally sheet
const tally = (c: Ctx, x: number, y: number, n: number) => { let k = 0, gx = x; while (k < n) { const g = Math.min(4, n - k); for (let i = 0; i < g; i++) line(c, [[gx + i * 22, y - 40], [gx + i * 22, y + 40]], 6); if (n - k >= 5) { line(c, [[gx - 10, y + 30], [gx + 76, y - 30]], 6); k += 5; } else k += g; gx += 120; } };
const fruitMango = (c: Ctx, x: number, y: number, r: number) => { const p = () => { c.moveTo(x - r, y); c.bezierCurveTo(x - r, y - r * 1.1, x + r * 1.1, y - r * 1.1, x + r * 1.05, y + r * 0.1); c.bezierCurveTo(x + r * 0.9, y + r * 0.9, x - r * 0.5, y + r * 0.9, x - r, y); c.closePath(); }; shape(c, p, COL.yellow, 5); shade(c, p, COL.orange, r * 0.3, r * 0.25); line(c, [[x - r * 0.9, y - r * 0.15], [x - r * 1.1, y - r * 0.5]], 5, COL.leafDk); };
const fruitBanana = (c: Ctx, x: number, y: number, r: number) => { const p = () => { c.moveTo(x - r, y - r * 0.2); c.quadraticCurveTo(x, y + r * 0.9, x + r, y - r * 0.3); c.quadraticCurveTo(x + r * 1.08, y - r * 0.1, x + r * 0.95, y); c.quadraticCurveTo(x, y + r * 1.25, x - r * 0.95, y + r * 0.1); c.closePath(); }; shape(c, p, COL.yellow, 5); shade(c, p, "#d9ad2a", r * 0.1, r * 0.2); line(c, [[x + r * 0.95, y - r * 0.18], [x + r * 1.1, y - r * 0.4]], 6, COL.brown); };
const fruitGuava = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r * 0.9, r), COL.greenLt, 5); shade(c, () => ell(c, x, y, r * 0.9, r), COL.green, r * 0.3, r * 0.25); for (let i = 0; i < 3; i++) line(c, [[x + (i - 1) * r * 0.22, y + r * 0.95], [x + (i - 1) * r * 0.32, y + r * 1.2]], 4, COL.leafDk); };
const fa3 = (c: Ctx) => {
  ground(c, "#f3ebdb");
  bust(c, 250, 980, 1.1, { mouth: "o", eyes: "open" });
  // phone held at the ear
  line(c, [[340, 880], [380, 700]], 44, INK); line(c, [[340, 880], [380, 700]], 34, CLOTH.child);
  c.save(); c.translate(360, 650); c.rotate(0.2); shape(c, () => rrect(c, -30, -80, 60, 160, 12), COL.black, 5); shape(c, () => rrect(c, -22, -66, 44, 118, 6), COL.sky, 0); c.restore();
  shape(c, () => ell(c, 378, 700, 40, 34, 0.3), SKIN.child, 5);
  // the tally sheet
  paper(c, 520, 120, 470, 820);
  const rows = [[fruitMango, 8], [fruitBanana, 3], [fruitGuava, 5], [null, 1]] as const;
  rows.forEach(([f, n], i) => { const y = 230 + i * 200; if (f) f(c, 610, y, 48); else { line(c, [[585, y - 30], [600, y - 50], [630, y - 45], [635, y - 15], [610, y + 5], [610, y + 20]], 8); shape(c, () => ell(c, 610, y + 45, 7, 7), INK, 0); } tally(c, 700, y, n); line(c, [[545, y + 100], [965, y + 100]], 2, COL.grey); });
};
// flow.a4 · feelings faces: Paati makes a surprised face; the child laughs and points
const fa4 = (c: Ctx) => {
  ground(c, "#f3ebdb");
  bust(c, 340, 1000, 1.35, { adult: true, cloth: COL.purple, clothDk: "#6a4fa3", grey: true, glasses: true, hair: "long", eyes: "wide", brows: "up", mouth: "o" });
  bust(c, 820, 1000, 1.0, { eyes: "closed", mouth: "big" });
  pointArm(c, [740, 900], [560, 700], SKIN.child, CLOTH.child, 32);
};
// flow.p1 · the kindness chain hung across a window
const fp1 = (c: Ctx) => {
  ground(c, "#f3ebdb");
  shape(c, () => rrect(c, 110, 70, 860, 880, 16), COL.wood, 6);
  shape(c, () => rrect(c, 160, 120, 760, 780, 8), COL.sky, 5);
  // a little sky: sun and a cloud
  shape(c, () => ell(c, 760, 300, 70, 70), COL.yellow, 5);
  shape(c, () => { c.moveTo(260, 520); c.arc(300, 520, 40, Math.PI, 0); c.arc(360, 510, 50, Math.PI, 0); c.arc(420, 525, 35, Math.PI, 0); c.lineTo(455, 560); c.lineTo(260, 560); c.closePath(); }, WHITE, 5);
  line(c, [[540, 120], [540, 900]], 14, COL.wood); line(c, [[160, 510], [920, 510]], 14, COL.wood);
  // the chain
  const cols = [COL.red, COL.yellow, COL.green, COL.blue, COL.pink, COL.purple, COL.orange];
  const pts = cols.map((_, i) => { const t = i / 6; return [185 + 710 * t, 160 + Math.sin(Math.PI * t) * 190]; });
  line(c, [[150, 140], [185, 160]], 6); line(c, [[930, 140], [895, 160]], 6);
  pts.forEach(([x, y], i) => { if (i % 2) { const [ax, ay] = pts[i - 1], [bx, by] = pts[i + 1]; const an = Math.atan2(by - ay, bx - ax); c.save(); c.translate(x, y); c.rotate(an); shape(c, () => rrect(c, -62, -30, 124, 60, 30), cols[i], 6); shade(c, () => rrect(c, -62, -30, 124, 60, 30), INK, 0, 20, 0.2); c.restore(); } });
  pts.forEach(([x, y], i) => {
    if (i % 2) return;
    shape(c, () => ell(c, x, y, 66, 50), cols[i], 6); shape(c, () => ell(c, x, y, 44, 30), COL.sky, 5);
    const d = i / 2;
    if (d === 0) shape(c, () => { c.moveTo(x, y + 68); c.bezierCurveTo(x - 30, y + 40, x - 14, y + 20, x, y + 36); c.bezierCurveTo(x + 14, y + 20, x + 30, y + 40, x, y + 68); c.closePath(); }, WHITE, 3);
    if (d === 1) shape(c, () => { c.moveTo(x, y + 28); c.quadraticCurveTo(x - 16, y + 52, x, y + 68); c.quadraticCurveTo(x + 16, y + 52, x, y + 28); c.closePath(); }, COL.water, 3);
    if (d === 2) shape(c, () => { for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + (k / 10) * Math.PI * 2, rr = k % 2 ? 9 : 20; k ? c.lineTo(x + Math.cos(a) * rr, y + 50 + Math.sin(a) * rr) : c.moveTo(x + Math.cos(a) * rr, y + 50 + Math.sin(a) * rr); } c.closePath(); }, WHITE, 3);
    if (d === 3) { for (let k = 0; k < 5; k++) { const a = (k / 5) * Math.PI * 2; shape(c, () => ell(c, x + Math.cos(a) * 14, y + 50 + Math.sin(a) * 14, 9, 9), WHITE, 2.5); } shape(c, () => ell(c, x, y + 50, 7, 7), COL.yellow, 2); }
  });
  write(c, "7", 505, 700, 150, INK, 12);
};
// term.2 · taste: tongue out; jaggery, lime, karela
const t2 = (c: Ctx) => {
  ground(c);
  bust(c, 540, 700, 1.6, { mouth: "tongue", eyes: "open" });
  tableBand(c, 690);
  jaggery(c, 260, 860, 72); limeHalf(c, 540, 860, 80); karela(c, 820, 860, 82);
};
// term.3 · kind: handing a box of crayons to another child
const t3 = (c: Ctx) => {
  ground(c, "#f3ebdb");
  bust(c, 240, 900, 1.1, { mouth: "smile" });
  bust(c, 840, 900, 1.1, { mouth: "smile", hair: "curly", cloth: COL.green, clothDk: COL.greenDk });
  tableBand(c, 820);
  line(c, [[330, 790], [470, 690]], 44, INK); line(c, [[330, 790], [470, 690]], 34, CLOTH.child);
  line(c, [[750, 790], [640, 700]], 44, INK); line(c, [[750, 790], [640, 700]], 34, COL.green);
  // crayon box
  const bx = 560, by = 700;
  const cs = [COL.red, COL.orange, COL.yellow, COL.green, COL.blue, COL.purple];
  cs.forEach((col, i) => shape(c, () => rrect(c, bx - 78 + i * 27, by - 110, 20, 90, 6), col, 4));
  cs.forEach((_, i) => shape(c, () => polyP(c, [[bx - 78 + i * 27, by - 110], [bx - 68 + i * 27, by - 130], [bx - 58 + i * 27, by - 110]]), cs[i], 4));
  shape(c, () => rrect(c, bx - 95, by - 60, 190, 110, 10), "#f2c54c", 6); shade(c, () => rrect(c, bx - 95, by - 60, 190, 110, 10), COL.woodDk, 30, 0, 0.5);
  shape(c, () => ell(c, 470, 690, 26, 26), SKIN.child, 5); shape(c, () => ell(c, 640, 700, 26, 26), SKIN.child, 5);
  arrow(c, [[400, 520], [700, 520]]);
};
// term.0 · similar: two children, ten fingers each
const t0 = (c: Ctx) => {
  ground(c, "#f3ebdb");
  const kid = (x: number, o: Face, cloth: string) => {
    for (const s of [-1, 1]) { line(c, [[x + s * 95, 750], [x + s * 160, 640]], 46, INK); line(c, [[x + s * 95, 750], [x + s * 160, 640]], 36, cloth); }
    bust(c, x, 920, 1.1, o);
    palm(c, x - 165, 585, 0.95, SKIN.child, 0.15); palm(c, x + 165, 585, 0.95, SKIN.child, -0.15);
    write(c, "10", x - 75, 935, 100, INK, 10);
  };
  kid(300, { mouth: "smile" }, CLOTH.child);
  kid(780, { mouth: "smile", hair: "curly", cloth: COL.green, clothDk: COL.greenDk }, COL.green);
};
// expl.1 · five fingertips, five different patterns of lines
const x1 = (c: Ctx) => {
  ground(c, "#f3ebdb");
  const tones = ["#d9a070", "#b9794f", "#a5673f", "#8d5a3b", "#6e4328"], dks = ["#7a4826", "#5e3418", "#4a2812", "#f0cfae", "#f0cfae"];
  tones.forEach((skin, i) => {
    const x = 130 + i * 205, w = 160, top = 160, cx = x + w / 2;
    const fp = () => { c.moveTo(x, D + 20); c.lineTo(x, top + 90); c.quadraticCurveTo(x, top, cx, top); c.quadraticCurveTo(x + w, top, x + w, top + 90); c.lineTo(x + w, D + 20); c.closePath(); };
    shadow(c, cx + 20, 1040, 90, 20);
    shape(c, fp, skin, 6);
    c.save(); c.beginPath(); fp(); c.clip();
    c.strokeStyle = dks[i]; c.lineWidth = 6; c.lineCap = "round"; c.globalAlpha = 0.8;
    const py = top + 150;
    for (let k = 1; k <= 9; k++) {
      c.beginPath();
      if (i === 0) c.ellipse(cx, py, k * 9, k * 12, 0, 0, Math.PI * 2);
      else if (i === 1) { c.moveTo(x - 20, py + 160); c.quadraticCurveTo(cx - 40 + k * 4, py - 150 + k * 22, cx + 70 - k * 3, py + 160 - k * 2); }
      else if (i === 2) { c.moveTo(x - 10, py + 120 + k * 6); c.quadraticCurveTo(cx, py - 160 + k * 24, x + w + 10, py + 120 + k * 6); }
      else if (i === 3) { c.ellipse(cx, py, k * 10, k * 9, 0.4, 0, Math.PI * 2); }
      else { c.moveTo(x + w + 20, py + 160); c.quadraticCurveTo(cx + 40 - k * 4, py - 150 + k * 22, cx - 70 + k * 3, py + 160 - k * 2); }
      c.stroke();
    }
    for (let k = 0; k < 7; k++) { c.beginPath(); c.moveTo(x - 10, py + 280 + k * 50); c.quadraticCurveTo(cx, py + 240 + k * 50, x + w + 10, py + 280 + k * 50); c.stroke(); }
    c.restore(); c.globalAlpha = 1;
  });
};

export const ic_meAndOthersMeAndOthersL1 = cards("sci.me-and-others.me-and-others.L1", [se1a, se1b, se1c, se2a, se2b, fe2, fa1, fa2, fa3, fa4, fp1, t2, t3, t0, x1]);
