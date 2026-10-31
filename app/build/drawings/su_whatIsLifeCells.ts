import type { Ctx } from "./flatKit";
import { INK, BG, WHITE, RED, COL, SKIN, CLOTH, SH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, bowl, hand, cards, rnd } from "./flatKit";

// sci.what-is-life.cells.L3 set-up cards. Shared things first: the onion skin, the glass slide, the dropper,
// the ice-cream stick, the steel spoon and the circle that shows what a magnifier sees.
const ONION = "#f2d9e6", ONION_DK = "#d3a9c3", SKIN_FILM = "#f8eaf2";
const drop = (c: Ctx, x: number, y: number, r: number, col: string = COL.water) => {
  shape(c, () => { c.moveTo(x, y - r * 1.9); c.quadraticCurveTo(x + r * 0.4, y - r * 0.9, x + r, y); c.arc(x, y, r, 0, Math.PI); c.quadraticCurveTo(x - r * 0.4, y - r * 0.9, x, y - r * 1.9); c.closePath(); }, col, 5);
  shine(c, [[x - r * 0.45, y - r * 0.1], [x - r * 0.35, y + r * 0.45]], Math.max(3, r * 0.22));
};
// a glass slide lying flat, seen from the front and above: top face, glass edge, soft shadow
const SL = { x: 110, y: 640, w: 720, d: 170 };
const slide = (c: Ctx) => {
  const { x, y, w, d } = SL;
  shadow(c, x + w / 2 + 50, y + d + 36, w * 0.56, 26);
  shape(c, () => polyP(c, [[x, y + d], [x + w, y + d], [x + w, y + d + 22], [x, y + d + 22]]), COL.glassEdge);
  shape(c, () => polyP(c, [[x + 50, y], [x + w + 50, y], [x + w, y + d], [x, y + d]]), "#e1f1fb");
  shine(c, [[x + 120, y + 18], [x + 80, y + d - 20]], 8);
};
const bricks = (c: Ctx, x: number, y: number, w: number, h: number, cw: number, ch: number, col: string, lw = 3) => {
  c.strokeStyle = col; c.lineWidth = lw; c.lineCap = "round";
  for (let r = 0, yy = y; yy < y + h + ch; r++, yy += ch) {
    c.beginPath(); c.moveTo(x, yy); c.lineTo(x + w, yy); c.stroke();
    for (let xx = x - (r % 2 ? cw / 2 : 0); xx < x + w + cw; xx += cw) { c.beginPath(); c.moveTo(xx, yy); c.lineTo(xx, yy + ch); c.stroke(); }
  }
};
// the thin onion skin lying on the slide
const skinOnSlide = (c: Ctx) => {
  const p = () => polyP(c, [[240, 670], [790, 670], [760, 790], [200, 790]]);
  shape(c, p, SKIN_FILM, 5);
  c.save(); c.beginPath(); p(); c.clip(); bricks(c, 190, 660, 620, 140, 80, 40, "rgba(190,130,170,0.55)", 2.5); c.restore();
};
// a glass dropper held by a hand from the right; its tip at (x, y)
const dropper = (c: Ctx, x: number, y: number, bulb: string, skin: string = SKIN.adult, sleeve: string = CLOTH.adult) => {
  shape(c, () => polyP(c, [[x - 9, y], [x + 9, y], [x + 20, y - 170], [x - 20, y - 170]]), COL.glass, 5);
  shape(c, () => polyP(c, [[x - 20, y - 170], [x + 20, y - 170], [x + 20, y - 200], [x - 20, y - 200]]), COL.steel, 5);
  shape(c, () => ell(c, x, y - 290, 54, 100), bulb);
  shade(c, () => ell(c, x, y - 290, 54, 100), COL.tealDk, 18, 0, 0.45);
  hand(c, x + 125, y - 290, Math.PI, 1.7, skin, sleeve);
};
// an ice-cream stick from its end E to its tip T (the hand covers the end)
const stick = (c: Ctx, ex: number, ey: number, tx: number, ty: number) => {
  const an = Math.atan2(ty - ey, tx - ex), len = Math.hypot(tx - ex, ty - ey);
  c.save(); c.translate(ex, ey); c.rotate(an);
  shape(c, () => rrect(c, 0, -24, len, 48, 22), COL.wood, 6);
  shade(c, () => rrect(c, 0, -24, len, 48, 22), COL.woodDk, 0, 14, 0.5);
  c.restore();
};
// a steel spoon: bowl at the tip (x, y), handle running back along angle an+PI; curd = what is in the bowl
const spoon = (c: Ctx, x: number, y: number, an: number, len: number, curd: string | null) => {
  c.save(); c.translate(x, y); c.rotate(an);
  line(c, [[-len, 0], [-30, 0]], 20, INK); line(c, [[-len, 0], [-30, 0]], 10, COL.steel);
  shape(c, () => ell(c, 0, 0, 52, 34), COL.steel, 6);
  shape(c, () => ell(c, 4, 0, 40, 24), COL.steelIn, 4);
  if (curd) shape(c, () => { c.moveTo(-30, 8); c.quadraticCurveTo(-24, -34, 6, -30); c.quadraticCurveTo(40, -26, 38, 8); c.quadraticCurveTo(4, 20, -30, 8); c.closePath(); }, curd, 5);
  c.restore();
};
// the round window that shows what the magnifier sees
const zoom = (c: Ctx, x: number, y: number, r: number, bg: string, inside: () => void) => {
  c.save(); c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fillStyle = bg; c.fill(); c.clip(); inside(); c.restore();
  c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.strokeStyle = INK; c.lineWidth = 12; c.stroke();
  c.beginPath(); c.arc(x, y, r - 14, Math.PI * 1.1, Math.PI * 1.45); c.strokeStyle = WHITE; c.globalAlpha = 0.7; c.lineWidth = 9; c.lineCap = "round"; c.stroke(); c.globalAlpha = 1;
};
const CURD = "#fffdf6";
const letter = (c: Ctx, ch: string, x: number, y: number, h: number) => {
  const w = h * 0.7, P: Record<string, number[][][]> = {
    A: [[[0, 1], [0.5, 0], [1, 1]], [[0.22, 0.62], [0.78, 0.62]]],
    B: [[[0, 0], [0, 1]], [[0, 0], [0.7, 0.05], [0.8, 0.25], [0.65, 0.48], [0, 0.5], [0.75, 0.52], [0.9, 0.75], [0.7, 0.98], [0, 1]]],
    C: [[[1, 0.18], [0.7, 0], [0.25, 0.05], [0, 0.5], [0.25, 0.95], [0.7, 1], [1, 0.82]]],
  };
  P[ch].forEach((st) => line(c, st.map(([u, v]) => [x + u * w, y + v * h]), 11, INK));
};
const tag = (c: Ctx, ch: string, x: number, y: number) => {
  shape(c, () => ell(c, x, y, 62, 62), WHITE, 6); letter(c, ch, x - 25, y - 32, 64);
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 945, 380, 36);
  const layer = () => { c.moveTo(220, 500); c.bezierCurveTo(300, 960, 800, 960, 880, 500); c.bezierCurveTo(780, 730, 320, 730, 220, 500); c.closePath(); };
  shape(c, layer, ONION, 7);
  shade(c, layer, ONION_DK, 0, 30, 0.5);
  line(c, [[300, 640], [420, 800], [620, 850]], 4, ONION_DK);
  line(c, [[400, 650], [500, 780], [700, 820]], 3, ONION_DK);
  // the thin skin peeling off the inside, held by two fingertips
  const sk = () => { c.moveTo(440, 668); c.quadraticCurveTo(620, 650, 760, 664); c.quadraticCurveTo(850, 580, 884, 440); c.quadraticCurveTo(780, 470, 700, 560); c.quadraticCurveTo(560, 640, 440, 668); c.closePath(); };
  shape(c, sk, "rgba(255,246,252,0.85)", 5);
  line(c, [[540, 656], [690, 590], [800, 500]], 3, "rgba(190,130,170,0.7)");
  hand(c, 164, 562, 0.2, 1.8, SKIN.adult, CLOTH.adult);
  hand(c, 948, 376, 2.5, 1.6, SKIN.child, CLOTH.child);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  slide(c); skinOnSlide(c);
  dropper(c, 495, 470, COL.teal);
  drop(c, 495, 570, 28);
  arrow(c, [[640, 500], [640, 600]]);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  // a window with the clear plastic and a big piece of onion skin against it
  shape(c, () => rrect(c, 50, 50, 540, 450, 14), "#cfe9f8", 8);
  line(c, [[320, 50], [320, 500]], 8); line(c, [[50, 275], [590, 275]], 8);
  shape(c, () => polyP(c, [[100, 95], [540, 95], [540, 455], [100, 455]]), "rgba(255,255,255,0.55)", 5);
  shape(c, () => ell(c, 300, 255, 190, 130), SKIN_FILM, 5);
  c.save(); c.beginPath(); ell(c, 300, 255, 190, 130); c.clip(); bricks(c, 110, 120, 380, 280, 60, 34, "rgba(190,130,170,0.6)", 2.5); c.restore();
  // the phone seen from its back, the camera lens right over the skin and a big water drop sitting on the lens
  const px = 400, py = 230;
  shadow(c, px + 150, py + 445, 150, 22);
  const body = () => rrect(c, px, py, 240, 430, 40);
  shape(c, body, COL.black, 7); shade(c, body, "#1f1b27", 22, 0, 0.5);
  shape(c, () => rrect(c, px + 12, py + 12, 150, 150, 34), "#4b4558", 6);
  shape(c, () => ell(c, px + 62, py + 62, 52, 52), COL.steelDk, 6); shape(c, () => ell(c, px + 62, py + 62, 36, 36), "#161420", 5);
  shape(c, () => ell(c, px + 122, py + 122, 20, 20), COL.steelDk, 5); shape(c, () => ell(c, px + 122, py + 40, 11, 11), COL.yellow, 4);
  shape(c, () => ell(c, px + 62, py + 62, 32, 32), "rgba(233,243,255,0.88)", 5);
  shine(c, [[px + 48, py + 54], [px + 54, py + 44]], 8);
  c.setLineDash([16, 14]); line(c, [[px + 90, py + 100], [700, 520]], 5, COL.greyDk); c.setLineDash([]);
  zoom(c, 850, 730, 220, "#f6e6ef", () => bricks(c, 580, 490, 520, 440, 110, 66, "rgba(150,80,130,0.7)", 6));
  hand(c, px + 120, 790, -Math.PI / 2, 2.0, SKIN.child, CLOTH.child);
};

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  shadow(c, 480, 905, 290, 28);
  for (const s of [-1, 1]) shape(c, () => ell(c, 500 + s * 272, 570, 40, 62), SKIN.child, 6);
  shape(c, () => ell(c, 500, 560, 270, 300), SKIN.child, 7);
  shade(c, () => ell(c, 500, 560, 270, 300), SKIN.childDk, 40, 20, 0.45);
  // hair
  shape(c, () => { c.moveTo(228, 520); c.bezierCurveTo(200, 180, 800, 180, 772, 520); c.bezierCurveTo(740, 400, 650, 340, 540, 360); c.bezierCurveTo(430, 340, 290, 400, 228, 520); c.closePath(); }, CLOTH.hair, 6);
  // eyes and brows
  for (const x of [390, 610]) { shape(c, () => ell(c, x, 500, 17, 25), INK, 0); shape(c, () => ell(c, x - 5, 492, 6, 8), WHITE, 0); line(c, [[x - 40, 440], [x + 36, 436]], 7); }
  line(c, [[498, 530], [488, 590], [520, 596]], 5, SKIN.childDk);
  // the right cheek, round and a little pink
  c.globalAlpha = 0.5; shape(c, () => ell(c, 660, 650, 70, 56), COL.pink, 0); c.globalAlpha = 1;
  // open mouth
  shape(c, () => ell(c, 490, 710, 120, 62), "#4a1f2a", 6);
  shape(c, () => rrect(c, 410, 654, 160, 28, 12), WHITE, 4);
  shape(c, () => ell(c, 480, 750, 70, 26), COL.pink, 0);
  // the stick, tip inside the cheek, and the hand on its end
  stick(c, 560, 700, 880, 748);
  hand(c, 899, 750, -2.995, 1.7, SKIN.adult, CLOTH.adult);
  arrow(c, [[690, 585], [790, 600]]); arrow(c, [[790, 640], [690, 625]]);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  slide(c);
  shape(c, () => { c.moveTo(380, 726); c.quadraticCurveTo(450, 686, 560, 712); c.quadraticCurveTo(660, 684, 760, 716); c.quadraticCurveTo(800, 738, 750, 760); c.quadraticCurveTo(620, 782, 480, 764); c.quadraticCurveTo(390, 768, 380, 726); c.closePath(); }, "#f7f2e6", 4);
  stick(c, 169, 465, 385, 730);
  hand(c, 163, 456, 0.9, 1.7, SKIN.child, CLOTH.child);
  dropper(c, 640, 500, COL.teal);
  drop(c, 640, 600, 26, COL.blue);
  arrow(c, [[780, 530], [780, 630]]);
};

// setup.e2.2
const e2_2 = (c: Ctx) => {
  ground(c);
  shadow(c, 340, 930, 300, 26);
  shape(c, () => rrect(c, 90, 850, 500, 80, 24), COL.teal);
  shade(c, () => rrect(c, 90, 850, 500, 80, 24), COL.tealDk, 0, 22, 0.55);
  // the arm, the tube, the eyepiece
  const arm = () => polyP(c, [[340, 250], [400, 250], [480, 280], [520, 370], [520, 850], [430, 850], [430, 380], [405, 340], [340, 340]]);
  shape(c, arm, COL.teal); shade(c, arm, COL.tealDk, 20, 0, 0.5);
  shape(c, () => rrect(c, 262, 250, 90, 300, 14), COL.steel); shade(c, () => rrect(c, 262, 250, 90, 300, 14), COL.steelDk, 20, 0, 0.5);
  shape(c, () => rrect(c, 282, 130, 50, 130, 12), COL.black);
  shape(c, () => rrect(c, 268, 112, 78, 36, 12), COL.steelDk);
  shape(c, () => rrect(c, 285, 550, 44, 64, 8), COL.steelDk);
  // stage, slide with a blue smear, light below
  shape(c, () => ell(c, 307, 770, 70, 22), COL.yellow, 5);
  shape(c, () => rrect(c, 160, 668, 290, 34, 10), COL.steel);
  shape(c, () => rrect(c, 235, 646, 140, 26, 6), "#e1f1fb", 5);
  shape(c, () => ell(c, 307, 658, 28, 8), COL.blue, 3);
  // focus knob and the hand turning it
  shape(c, () => ell(c, 480, 600, 44, 44), COL.steelDk, 6); shape(c, () => ell(c, 480, 600, 18, 18), COL.steel, 5);
  hand(c, 566, 700, -2.15, 1.6, SKIN.child, CLOTH.child);
  arrow(c, [[420, 560], [450, 520], [500, 510], [540, 530]]);
  // what the lens sees: blue cells like fried eggs
  zoom(c, 800, 300, 230, "#eef6ff", () => {
    const P: number[][] = [[690, 210], [830, 190], [940, 270], [740, 330], [880, 360], [660, 380], [800, 450], [930, 430], [720, 130], [970, 160]];
    P.forEach(([x, y], i) => { shape(c, () => ell(c, x, y, 62, 54, i * 0.7), "#cfe3f7", 5); shape(c, () => ell(c, x + 4, y, 20, 20), COL.blue, 4); });
  });
};

// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c);
  // the stove, a small low flame, the steel vessel with a handle
  shape(c, () => rrect(c, 120, 780, 840, 160, 24), COL.black);
  shape(c, () => ell(c, 540, 780, 150, 22), COL.greyDk, 5);
  for (const [fx, fh] of [[450, 40], [495, 52], [540, 60], [585, 52], [630, 40]]) shape(c, () => { c.moveTo(fx - 18, 776); c.quadraticCurveTo(fx - 8, 776 - fh * 0.6, fx, 776 - fh); c.quadraticCurveTo(fx + 8, 776 - fh * 0.6, fx + 18, 776); c.closePath(); }, COL.blue, 4);
  shape(c, () => rrect(c, 225, 478, 100, 40, 14), COL.black);
  const pot = () => { c.moveTo(310, 440); c.lineTo(770, 440); c.lineTo(750, 700); c.quadraticCurveTo(745, 730, 710, 730); c.lineTo(370, 730); c.quadraticCurveTo(335, 730, 330, 700); c.closePath(); };
  shape(c, pot, COL.steel); shade(c, pot, COL.steelDk, 80, 0, 0.55);
  shine(c, [[350, 500], [360, 680]], 10);
  shape(c, () => ell(c, 540, 440, 230, 44), COL.steelIn, 6);
  shape(c, () => ell(c, 540, 444, 205, 32), CURD, 4);
  for (const [bx, by, br] of [[430, 448, 14], [500, 458, 10], [620, 444, 16], [680, 454, 9], [570, 432, 8]]) shape(c, () => ell(c, bx, by, br, br * 0.7), WHITE, 3);
  spoon(c, 470, 455, 2.5, 440, CURD);
  hand(c, 775, 226, 2.5, 1.7, SKIN.adult, CLOTH.adult);
  const pts: number[][] = []; for (let t = 0.15; t <= 2.7; t += 0.2) pts.push([540 + 150 * Math.cos(t), 450 + 22 * Math.sin(t)]);
  arrow(c, pts.reverse().map(([x, y]) => [x, y + 6]));
};

const MILK = "#f6eed8";
// a rounded lump of curd, centre (x, y), radius r
const lump = (c: Ctx, x: number, y: number, r: number, col: string = CURD) => {
  shape(c, () => { c.moveTo(x - r, y + r * 0.2); c.bezierCurveTo(x - r * 1.1, y - r * 1.2, x + r * 1.1, y - r * 1.2, x + r, y + r * 0.2); c.bezierCurveTo(x + r * 0.6, y + r * 0.9, x - r * 0.6, y + r * 0.9, x - r, y + r * 0.2); c.closePath(); }, col, 5);
};
// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e3d3b3"; c.fillRect(0, 860, 1080, 220); line(c, [[0, 860], [1080, 860]], 6);
  const xs = [190, 540, 890], by = 700, r = 150;
  xs.forEach((x, i) => {
    bowl(c, x, by, r, MILK);
    tag(c, "ABC"[i], x, 970);
  });
  // A: one thick spoon of curd falling into the milk. B: nothing. C: the boiled curd, broken into lumps and watery whey
  const held = (x: number, an: number, skin: string, sleeve: string) => {
    spoon(c, x, 420, an, 360, null);
    hand(c, x - Math.cos(an) * 315, 420 - Math.sin(an) * 315, an, 1.5, skin, sleeve);
  };
  held(215, 1.2, SKIN.adult, CLOTH.adult);
  lump(c, 222, 408, 30); lump(c, 190, 590, 36);
  arrow(c, [[300, 480], [300, 560]]);
  for (const x of [190, 190]) { c.beginPath(); ell(c, x, by + 8, 70, 14); c.strokeStyle = "rgba(43,35,64,0.35)"; c.lineWidth = 4; c.stroke(); }
  held(865, Math.PI - 1.2, SKIN.child, CLOTH.child);
  lump(c, 855, 410, 14); lump(c, 885, 414, 12); lump(c, 870, 394, 11);
  lump(c, 880, 580, 17, "#efe9d0"); lump(c, 915, 600, 13, "#efe9d0"); lump(c, 852, 612, 12, "#efe9d0");
  drop(c, 905, 520, 12, "#e8ecb8"); drop(c, 840, 550, 10, "#e8ecb8");
  arrow(c, [[780, 480], [780, 560]]);
  c.beginPath(); ell(c, 890, by + 8, 70, 14); c.strokeStyle = "rgba(43,35,64,0.35)"; c.lineWidth = 4; c.stroke();
};

// setup.e3.2
const e3_2 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e3d3b3"; c.fillRect(0, 850, 1080, 230); line(c, [[0, 850], [1080, 850]], 6);
  const xs = [200, 530, 860], cy = 480, r = 125, th = 0.7;
  xs.forEach((cx, i) => {
    const outer = () => { c.moveTo(-r, 0); c.bezierCurveTo(-r * 0.9, r * 0.95, r * 0.9, r * 0.95, r, 0); c.closePath(); };
    const cav = () => { c.moveTo(-r + 16, 0); c.bezierCurveTo(-r * 0.9 + 14, r * 0.95 - 18, r * 0.9 - 14, r * 0.95 - 18, r - 16, 0); c.closePath(); };
    const lip = [cx + r * Math.cos(th), cy + r * Math.sin(th)];
    if (i > 0) { // milk still runs: a wide stream over the lower lip, a big puddle on the counter, splashes
      shape(c, () => { c.moveTo(lip[0] - 8, lip[1] - 4); c.quadraticCurveTo(lip[0] + 22, lip[1] + 50, lip[0] + 18, 846); c.lineTo(lip[0] + 58, 846); c.quadraticCurveTo(lip[0] + 56, lip[1] + 40, lip[0] + 30, lip[1] - 8); c.closePath(); }, MILK, 5);
      shape(c, () => ell(c, lip[0] + 38, 868, 85, 20), MILK, 5);
      drop(c, lip[0] - 20, 826, 10, MILK); drop(c, lip[0] + 90, 822, 10, MILK);
    }
    c.save(); c.translate(cx, cy); c.rotate(th);
    shape(c, outer, COL.steel); shade(c, outer, COL.steelDk, 24, 6, 0.55);
    shape(c, cav, COL.steelIn, 4);
    c.save(); c.beginPath(); cav(); c.clip();
    if (i === 0) { // set: the curd fills the bowl, keeps its shape and bulges at the lip without flowing
      c.beginPath(); c.moveTo(-r, 6); c.quadraticCurveTo(0, -46, r, 6); c.lineTo(r, r); c.lineTo(-r, r); c.closePath(); c.fillStyle = CURD; c.fill();
      line(c, [[-r, 6], [-r * 0.5, -16], [0, -24], [r * 0.5, -16], [r, 6]], 5);
      line(c, [[-40, 40], [10, 30]], 4, "rgba(43,35,64,0.25)"); line(c, [[20, 70], [70, 56]], 4, "rgba(43,35,64,0.25)");
    } else { // runny: the milk lies level
      c.rotate(-th); c.fillStyle = MILK; c.fillRect(-400, r * Math.sin(th) - 2, 800, 400);
      line(c, [[-400, r * Math.sin(th) - 2], [400, r * Math.sin(th) - 2]], 5);
    }
    c.restore();
    c.restore();
    // the hand under the bowl
    const gx = cx - Math.sin(th) * 0.6 * r - 10, gy = cy + Math.cos(th) * 0.6 * r + 20, ca = -1.0;
    hand(c, gx - Math.cos(ca) * 100, gy - Math.sin(ca) * 100, ca, 1.3, i === 1 ? SKIN.adult : SKIN.child, i === 1 ? CLOTH.adult : CLOTH.child);
    // tilt arrow over the bowl
    const ap: number[][] = []; for (let t = -2.0; t <= -0.9; t += 0.1) ap.push([cx + 175 * Math.cos(t), cy + 175 * Math.sin(t)]);
    arrow(c, ap);
    tag(c, "ABC"[i], cx, 130);
  });
};

export const su_whatIsLifeCells = cards("sci.what-is-life.cells.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
