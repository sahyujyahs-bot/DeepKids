import type { Ctx } from "./core";
import { INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, cards } from "./flatKit";

// sci.community.transport-and-communication.L3 set-up cards: a cloth on a chair in a doorway, a dim hanky torch,
// a heel-to-toe walk, a results table, and the back-to-back drawing game.

const DARKROOM = "#4a4570", DARKFLOOR = "#3a3560", SHIRT = "#2c2733", SHIRTDK = "#1b1822";
const HALL = "#e6d3ad";

// a number centred at (cx, cy), height h
const num = (c: Ctx, s: string, cx: number, cy: number, h: number, col: string = INK, w = 8) => {
  const total = (s.length - 1) * 0.8 * h + 0.6 * h;
  write(c, s, cx - total / 2, cy - h / 2, h, col, w);
};
// a shoe seen from above, toe at the left: toe cap, laces, the opening at the heel; len is toe to heel
const foot = (c: Ctx, x: number, y: number, len: number) => {
  const L = len, sh = () => { c.moveTo(x - 0.5 * L, y); c.bezierCurveTo(x - 0.5 * L, y - 0.24 * L, x - 0.3 * L, y - 0.24 * L, x - 0.2 * L, y - 0.21 * L); c.lineTo(x + 0.35 * L, y - 0.15 * L); c.bezierCurveTo(x + 0.52 * L, y - 0.15 * L, x + 0.52 * L, y + 0.15 * L, x + 0.35 * L, y + 0.15 * L); c.lineTo(x - 0.2 * L, y + 0.21 * L); c.bezierCurveTo(x - 0.3 * L, y + 0.24 * L, x - 0.5 * L, y + 0.24 * L, x - 0.5 * L, y); c.closePath(); };
  shape(c, sh, COL.blue, 5); shade(c, sh, COL.blueDk, 0, L * 0.1, 0.55);
  line(c, [[x - 0.28 * L, y - 0.2 * L], [x - 0.22 * L, y], [x - 0.28 * L, y + 0.2 * L]], 4, INK);
  for (const u of [-0.08, 0.03, 0.14]) line(c, [[x + u * L, y - 0.1 * L], [x + u * L, y + 0.1 * L]], 5, WHITE);
  shape(c, () => ell(c, x + 0.32 * L, y, 0.1 * L, 0.1 * L), COL.sky, 4);
};
const tick = (c: Ctx, x: number, y: number, s: number) => {
  line(c, [[x - s * 0.5, y], [x - s * 0.1, y + s * 0.45], [x + s * 0.6, y - s * 0.55]], 18, INK);
  line(c, [[x - s * 0.5, y], [x - s * 0.1, y + s * 0.45], [x + s * 0.6, y - s * 0.55]], 10, COL.green);
};
const cross = (c: Ctx, x: number, y: number, s: number) => {
  for (const pts of [[[x - s * 0.5, y - s * 0.5], [x + s * 0.5, y + s * 0.5]], [[x + s * 0.5, y - s * 0.5], [x - s * 0.5, y + s * 0.5]]]) { line(c, pts, 18, INK); line(c, pts, 10, RED); }
};

// the chair with a black T-shirt over its back, standing on the floor at (cx, fy), scale k
const chairShirt = (c: Ctx, cx: number, fy: number, k: number) => {
  c.save(); c.translate(cx, fy); c.scale(k, k);
  shadow(c, 20, 6, 190, 22);
  for (const x of [-112, 94]) shape(c, () => rrect(c, x, -230, 18, 230, 6), COL.woodDk);
  const seat = () => rrect(c, -140, -250, 280, 50, 10);
  shape(c, seat, COL.wood); shade(c, seat, COL.woodDk, 12, 16, 0.5);
  for (const x of [-132, 106]) { const leg = () => rrect(c, x, -204, 26, 204, 8); shape(c, leg, COL.wood); shade(c, leg, COL.woodDk, 9, 0, 0.5); }
  for (const x of [-128, 104]) { const post = () => rrect(c, x, -568, 24, 330, 8); shape(c, post, COL.wood); shade(c, post, COL.woodDk, 9, 0, 0.5); }
  // the shirt: body hanging over the back, two sleeves, the neck hole
  const body = () => rrect(c, -142, -540, 284, 290, 18);
  shape(c, () => polyP(c, [[-130, -532], [-212, -430], [-176, -385], [-122, -450]]), SHIRT);
  shape(c, () => polyP(c, [[130, -532], [212, -430], [176, -385], [122, -450]]), SHIRT);
  shape(c, body, SHIRT); shade(c, body, SHIRTDK, 36, 0, 0.8);
  shape(c, () => ell(c, 0, -536, 54, 22), SHIRTDK, 5);
  c.globalAlpha = 0.28; line(c, [[-125, -526], [-60, -532]], 8, WHITE); line(c, [[-90, -470], [-84, -300]], 7, WHITE); line(c, [[20, -480], [28, -310]], 7, WHITE); c.globalAlpha = 1;
  c.restore();
};

// setup.e1.0
const su_e1_0 = (c: Ctx) => {
  ground(c);
  // the lit hall floor
  c.fillStyle = HALL; c.fillRect(0, 880, 1080, 200);
  line(c, [[0, 880], [1080, 880]], 6);
  // the doorway: wooden frame, dark room inside
  shape(c, () => rrect(c, 200, 70, 680, 830, 10), COL.woodDk);
  shape(c, () => rrect(c, 255, 125, 570, 755, 4), DARKROOM, 6);
  shape(c, () => polyP(c, [[255, 800], [825, 800], [825, 880], [255, 880]]), DARKFLOOR, 0);
  line(c, [[255, 800], [825, 800]], 4, INK);
  chairShirt(c, 540, 880, 1);
};

// setup.e1.1
const su_e1_1 = (c: Ctx) => {
  ground(c);
  // the dim glow through the cloth
  c.beginPath(); ell(c, 540, 270, 250, 210); c.fillStyle = "rgba(255,211,77,0.30)"; c.fill();
  const body = () => rrect(c, 390, 260, 300, 640, 40);
  shape(c, body, COL.blueDk); shade(c, body, "#2c5287", 40, 0, 0.7);
  shape(c, () => ell(c, 540, 760, 36, 36), COL.blue, 5);
  // the hanky folded in layers: the thick folded edge shows on the right and the bottom
  for (const d of [20, 10]) shape(c, () => rrect(c, 330 + d, 170 + d, 420, 290, 20), d === 20 ? "#e6dfcf" : COL.cloth, 5);
  const hanky = () => rrect(c, 330, 170, 420, 290, 20);
  shape(c, hanky, "#fffaf0"); shade(c, hanky, COL.grey, 40, 24, 0.35);
  c.beginPath(); ell(c, 540, 270, 130, 80); c.fillStyle = "rgba(255,211,77,0.45)"; c.fill();
  shape(c, () => rrect(c, 358, 198, 364, 234, 12), "rgba(0,0,0,0)", 6);
  c.save(); c.beginPath(); rrect(c, 358, 198, 364, 234, 12); c.strokeStyle = COL.blue; c.lineWidth = 8; c.stroke(); c.restore();
  line(c, [[540, 232], [540, 400]], 4, COL.grey); line(c, [[392, 315], [690, 315]], 4, COL.grey);
  // the rubber band round the phone and the cloth
  const band = () => rrect(c, 372, 400, 336, 44, 20);
  shape(c, band, COL.orange); shade(c, band, "#c9731f", 0, 14, 0.5);
  // the hand holding the phone from below
  hand(c, 540, 1020, -Math.PI / 2, 2.4, SKIN.adult, CLOTH.adult);
};

// setup.e1.2
const su_e1_2 = (c: Ctx) => {
  ground(c, DARKROOM);
  c.fillStyle = DARKFLOOR; c.fillRect(0, 880, 1080, 200);
  line(c, [[0, 880], [1080, 880]], 6);
  chairShirt(c, 190, 880, 0.75);
  // the dim beam from the torch to the cloth
  c.fillStyle = "rgba(255,226,120,0.28)"; c.beginPath(); polyP(c, [[505, 296], [300, 470], [300, 700], [505, 316]]); c.fill();
  // the foot-prints, heel touching toe, and the way back
  for (const x of [330, 470, 610]) foot(c, x, 958, 140);
  arrow(c, [[300, 1045], [720, 1045]]);
  // the grown-up and the child, with shoes
  const shoes = (x: number, h: number) => { for (const s of [-1, 1]) shape(c, () => ell(c, x + s * h * 0.06 + 2, 884, 0.06 * h, 16), COL.blueDk, 5); };
  person(c, 910, 880, 740, { adult: true }); shoes(910, 740);
  const cx = 650, cy = 880, h = 640;
  person(c, cx, cy, h, { armL: [Math.PI + 0.3, Math.PI + 2.2] }); shoes(cx, h);
  // the torch in her hand, beside her eye
  shape(c, () => rrect(c, 510, 255, 50, 100, 12), COL.black);
  shape(c, () => rrect(c, 506, 250, 58, 40, 12), "#fffaf0", 5);
  shape(c, () => ell(c, 534, 322, 22, 22), SKIN.child, 5);
};

// setup.e1.3
const su_e1_3 = (c: Ctx) => {
  ground(c);
  shadow(c, 480, 960, 400, 30);
  shape(c, () => rrect(c, 90, 90, 750, 860, 12), COL.paper, 7);
  // grid
  const ys = [130, 270, 430, 590, 750, 910];
  for (const y of ys.slice(1)) line(c, [[90, y], [840, y]], 6);
  line(c, [[90, 130], [840, 130]], 0.1, COL.paper);
  for (const x of [280, 560]) line(c, [[x, 130], [x, 910]], 6);
  // header: foot-prints, one dot for the first try, two for the second
  foot(c, 420, 190, 130); foot(c, 700, 190, 130);
  shape(c, () => ell(c, 420, 245, 9, 9), INK, 0);
  shape(c, () => ell(c, 690, 245, 9, 9), INK, 0); shape(c, () => ell(c, 712, 245, 9, 9), INK, 0);
  // the four cloths and the foot-steps counted
  const rows: [string, string, string, string][] = [["#25212d", "#17141d", "5", "6"], ["#2f3f8c", "#223070", "8", "7"], [COL.yellow, COL.orange, "12", "11"], [WHITE, COL.steelIn, "16", "15"]];
  rows.forEach(([col, dk, a, b], i) => {
    const y = ys[i + 1] + 80;
    const cloth = () => rrect(c, 130, y - 55, 110, 110, 14);
    shape(c, cloth, col); shade(c, cloth, dk, 28, 28, 0.6);
    line(c, [[150, y - 25], [220, y - 18]], 4, "rgba(255,255,255,0.4)");
    num(c, a, 385, y, 80); num(c, b, 665, y, 80); foot(c, 510, y, 64); foot(c, 790, y, 64);
  });
  // the pencil beside the paper
  const pencil = () => polyP(c, [[925, 250], [975, 250], [975, 800], [950, 860], [925, 800]]);
  shape(c, pencil, COL.yellow); shade(c, pencil, COL.orange, 22, 0, 0.7);
  shape(c, () => polyP(c, [[925, 800], [975, 800], [950, 860]]), "#f2d8b0", 5);
  shape(c, () => polyP(c, [[943, 838], [957, 838], [950, 860]]), INK, 0);
  shape(c, () => rrect(c, 925, 215, 50, 40, 8), COL.pink);
};

// the four shapes on a picture card or a drawing, in a W x H frame at (X, Y). triDx, triDy move the triangle.
const shapesOn = (c: Ctx, X: number, Y: number, W: number, H: number, pencil: boolean, triDx = 0, triDy = 0) => {
  const r = Math.min(0.2 * W, 0.24 * H), ccx = X + 0.3 * W, ccy = Y + 0.36 * H, sq = r * 0.8;
  const tcx = X + 0.72 * W + triDx, tcy = Y + 0.72 * H + triDy, tw = 0.3 * W, th = Math.min(0.26 * W, 0.3 * H);
  const lw = pencil ? 7 : 8, ink = pencil ? "#4d4858" : INK;
  const f = (col: string) => (pencil ? "rgba(0,0,0,0)" : col);
  const p0 = [ccx + r * 0.71, ccy + r * 0.71], p1 = [tcx - tw * 0.12, tcy - th * 0.1];
  c.beginPath(); ell(c, ccx, ccy, r, r); c.fillStyle = f(COL.sky); c.fill(); c.lineWidth = lw; c.strokeStyle = ink; c.stroke();
  c.beginPath(); rrect(c, ccx - sq / 2, ccy - sq / 2, sq, sq, 3); c.fillStyle = f(COL.orange); c.fill(); c.stroke();
  const tri = [[tcx, tcy - th / 2], [tcx + tw / 2, tcy + th / 2], [tcx - tw / 2, tcy + th / 2]];
  c.beginPath(); polyP(c, tri); c.fillStyle = f(COL.teal); c.fill(); c.stroke();
  line(c, [p0, p1], lw, ink);
  const dx = p1[0] - p0[0], dy = p1[1] - p0[1], d = Math.hypot(dx, dy);
  return { circle: [ccx - r * 0.72 - 14, ccy - r * 0.72 - 14], square: [ccx + sq * 0.5 + 6, ccy + sq * 0.5 + 6], tri: [tcx + tw * 0.5 + 10, tcy - th * 0.1], link: [(p0[0] + p1[0]) / 2 - (dy / d) * 40, (p0[1] + p1[1]) / 2 + (dx / d) * 40] };
};
// a picture card with a thick coloured border
const pictureCard = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shape(c, () => rrect(c, x, y, w, h, 18), COL.purple, 7);
  shape(c, () => rrect(c, x + 14, y + 14, w - 28, h - 28, 10), COL.paper, 5);
  shapesOn(c, x + 14, y + 14, w - 28, h - 28, false);
};

// setup.e2.0
const su_e2_0 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 900, 290, 20);
  pictureCard(c, 290, 90, 500, 810);
  hand(c, 540, 1000, -Math.PI / 2, 2.3, SKIN.child, CLOTH.child);
};

// a head seen from the side, looking right (flip the canvas to look left): hair at the back, one eye, a nose
const sideHead = (c: Ctx, x: number, hy: number, r: number, skin: string, bun: boolean) => {
  const head = () => ell(c, x, hy, r, r * 1.05), a = -0.35;
  shape(c, () => rrect(c, x - 0.3 * r, hy + 0.6 * r, 0.6 * r, 0.9 * r, 6), skin, 5);
  if (bun) shape(c, () => ell(c, x - r * 0.95, hy - r * 0.15, r * 0.36, r * 0.55), CLOTH.hair, 5);
  shape(c, () => ell(c, x + r * 0.98, hy + r * 0.14, r * 0.17, r * 0.2), skin, 4);
  shape(c, head, skin, 5);
  shape(c, () => { c.ellipse(x, hy, r, r * 1.05, 0, a, a - Math.PI - 1.0, true); c.bezierCurveTo(x - 0.2 * r, hy + 0.25 * r, x + 0.1 * r, hy - 0.1 * r, x + r * Math.cos(a), hy + r * 1.05 * Math.sin(a)); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, x + r * 0.5, hy + r * 0.05, r * 0.09, r * 0.13), INK, 0);
  shape(c, () => ell(c, x + r * 0.02, hy + r * 0.3, r * 0.13, r * 0.2), skin === SKIN.child ? SKIN.childDk : SKIN.adultDk, 3);
  c.beginPath(); c.arc(x + r * 0.58, hy + r * 0.45, r * 0.22, 0.4, 1.9); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
};

// a person sitting on a chair (seat at y), lower legs down to the floor fy, facing right, head seen from the side
const sitter = (c: Ctx, x: number, y: number, fy: number, h: number, adult: boolean, arms: [[number, number], [number, number]] = [[0.9, 0.2], [0.9, 0.2]]) => {
  const sh = y - 0.38 * h;
  shadow(c, x + 0.1 * h, fy + 6, 0.38 * h, 18);
  // chair: back plank (down to the floor), seat, front leg
  const back = () => rrect(c, x - 0.15 * h - 12, sh - 0.02 * h, 24, fy - sh + 0.02 * h, 8);
  shape(c, back, COL.wood); shade(c, back, COL.woodDk, 9, 0, 0.5);
  const seat = () => rrect(c, x - 0.15 * h, y - 10, 0.37 * h, 34, 10);
  const legF = () => rrect(c, x + 0.2 * h, y + 10, 24, fy - y - 10, 8);
  shape(c, legF, COL.woodDk);
  shape(c, seat, COL.wood); shade(c, seat, COL.woodDk, 12, 14, 0.5);
  // lower legs, longer than the kit's, down to the shoes
  const lx = x + 0.3 * h;
  for (const s of [-1, 1]) {
    const pts = [[lx + s * 0.03 * h, y], [lx + s * 0.03 * h, fy - 14]];
    line(c, pts, 0.07 * h, INK); line(c, pts, 0.07 * h - 10, "#6b5a8c");
    shape(c, () => ell(c, lx + s * 0.03 * h + 18, fy - 12, 36, 15), COL.blueDk, 5);
  }
  person(c, x, y, h, { sit: true, adult, armL: arms[0], armR: arms[1] });
  // the kit's front-facing head is painted over by a side view
  const head = h * 0.13, hy = sh - head * 1.05;
  c.fillStyle = BG; c.fillRect(x - head * (adult ? 1.15 : 1.35), hy - head * 2, head * (adult ? 2.3 : 2.7), sh - 0.02 * h - (hy - head * 2));
  sideHead(c, x, hy, head, adult ? SKIN.adult : SKIN.child, !adult);
};

// setup.e2.1
const su_e2_1 = (c: Ctx) => {
  ground(c);
  const fy = 930, y = 740;
  c.fillStyle = HALL; c.fillRect(0, fy, 1080, 150); line(c, [[0, fy], [1080, fy]], 6);
  const cc = 420, ca = 640, hc = 600, ha = 660;
  // the child, flipped to look left; her near arm holds the picture card up at the bottom edge
  c.save(); c.translate(cc, 0); c.scale(-1, 1); c.translate(-cc, 0);
  sitter(c, cc, y, fy, hc, false, [[0.9, 0.2], [0.9, -Math.PI / 2]]);
  c.restore();
  const cardX = 60, cardW = 230, cardY = 245, cardH = 255;
  shape(c, () => rrect(c, cardX, cardY, cardW, cardH, 12), COL.purple, 6);
  shape(c, () => rrect(c, cardX + 10, cardY + 10, cardW - 20, cardH - 20, 6), COL.paper, 4);
  shapesOn(c, cardX + 10, cardY + 10, cardW - 20, cardH - 20, false);
  hand(c, 231, 548, -Math.PI / 2, 0.9, SKIN.child, CLOTH.child);
  // her words, a circle and a square, going over the chairs to the grown-up's ear
  shape(c, () => polyP(c, [[290, 175], [345, 175], [385, 345]]), WHITE, 5);
  shape(c, () => ell(c, 330, 110, 150, 85), WHITE, 5);
  shape(c, () => polyP(c, [[296, 160], [340, 160], [344, 200]]), WHITE, 0);
  shape(c, () => ell(c, 285, 110, 42, 42), COL.sky, 6);
  shape(c, () => rrect(c, 345, 78, 62, 62, 6), COL.orange, 6);
  // the grown-up, drawing on a board on the lap, the pencil on the paper
  sitter(c, ca, y, fy, ha, true);
  c.save(); c.translate(ca + 215, 690); c.rotate(-0.2);
  shape(c, () => rrect(c, -125, -90, 250, 180, 8), COL.wood, 6);
  shape(c, () => rrect(c, -110, -75, 220, 150, 4), WHITE, 4);
  c.beginPath(); ell(c, -50, -15, 42, 42); c.strokeStyle = "#4d4858"; c.lineWidth = 7; c.stroke();
  c.beginPath(); rrect(c, -62, -27, 24, 24, 2); c.stroke();
  line(c, [[-14, 14], [50, 42]], 7, "#4d4858");
  c.restore();
  line(c, [[ca + 300, 630], [ca + 272, 722]], 16, INK); line(c, [[ca + 300, 630], [ca + 272, 722]], 8, COL.yellow);
  hand(c, ca + 285, 585, 1.75, 0.8, SKIN.adult, CLOTH.adult);
  arrow(c, [[500, 100], [610, 120], [680, 250]]);
};

// setup.e2.2
const su_e2_2 = (c: Ctx) => {
  ground(c);
  const W = 420;
  // left pair: the triangle is in the wrong place; right pair: all four right
  for (const col of [{ x: 90, bad: true, score: "6" }, { x: 570, bad: false, score: "8" }]) {
    pictureCard(c, col.x, 60, W, 260);
    shadow(c, col.x + W / 2 + 14, 840, W / 2, 16);
    shape(c, () => rrect(c, col.x, 360, W, 470, 10), WHITE, 6);
    const a = shapesOn(c, col.x + 14, 374, W - 28, 442, true, col.bad ? 0.08 * W : 0, col.bad ? -0.40 * 442 : 0);
    tick(c, a.circle[0], a.circle[1], 34);
    tick(c, a.square[0], a.square[1], 28);
    if (col.bad) cross(c, a.tri[0] + 6, a.tri[1] - 6, 38); else tick(c, a.tri[0], a.tri[1], 34);
    tick(c, a.link[0], a.link[1], 30);
    shape(c, () => ell(c, col.x + W / 2, 945, 70, 70), COL.greenLt, 7);
    num(c, col.score, col.x + W / 2, 945, 84, INK, 10);
  }
};

export const su_communityTransportAndCommunication = cards("sci.community.transport-and-communication.L3 set-up", [su_e1_0, su_e1_1, su_e1_2, su_e1_3, su_e2_0, su_e2_1, su_e2_2]);
