import type { Ctx } from "./core";
import { INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, cards } from "./flatKit";

// sci.light.how-we-see.L3 set-up cards: a shoebox dark box, a pupil card, a torch and a toy elephant.

const BOX = { top: "#d9a066", mid: "#c58a52", dk: "#a8723f", glass: "rgba(197,138,82,0.30)" };
const DARK = "#14111f";

// a hand coming in from the right, pointing left (flatKit hands point right)
const handLeft = (c: Ctx, x: number, y: number, an: number, s: number, adult = true) => {
  c.save(); c.translate(x, y); c.scale(-1, 1);
  if (adult) hand(c, 0, 0, an, s, SKIN.adult, CLOTH.adult); else hand(c, 0, 0, an, s);
  c.restore();
};
// the sleeve and arm running from a wrist back out of the picture
const arm = (c: Ctx, x: number, y: number, dx: number, dy: number, col: string = CLOTH.adult) => {
  line(c, [[x, y], [x + dx * 900, y + dy * 900]], 76, INK); line(c, [[x, y], [x + dx * 900, y + dy * 900]], 64, col);
};

// the three things hidden in the box, standing on the box floor at y = base, starting at x = L
const boxThings = (c: Ctx, L: number, base: number) => {
  shadow(c, L + 90, base + 4, 60, 11);
  shape(c, () => ell(c, L + 75, base - 52, 52, 52), COL.red);
  shade(c, () => ell(c, L + 75, base - 52, 52, 52), "#a8301f", -14, -10, 0.55);
  shine(c, [[L + 52, base - 76], [L + 62, base - 88]], 8);
  line(c, [[L + 165, base - 18], [L + 300, base - 18]], 24, INK); line(c, [[L + 165, base - 18], [L + 300, base - 18]], 13, COL.steel);
  shape(c, () => ell(c, L + 345, base - 20, 46, 26), COL.steel);
  shape(c, () => ell(c, L + 342, base - 22, 30, 15), COL.steelIn, 3);
  shape(c, () => polyP(c, [[L + 410, base], [L + 525, base], [L + 514, base - 135], [L + 398, base - 135]]), WHITE);
  for (const k of [30, 60, 90]) line(c, [[L + 420 + k * 0.05, base - k - 12], [L + 500 - k * 0.05, base - k - 12]], 4, COL.grey);
};

// setup.e1.0
const su_e1_0 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 820, 470, 44);
  // the end face with the peephole (darkest, it turns away from the light)
  const end = () => polyP(c, [[770, 470], [900, 380], [900, 680], [770, 770]]);
  const top = () => polyP(c, [[150, 470], [770, 470], [900, 380], [280, 380]]);
  boxThings(c, 180, 750);
  shape(c, () => rrect(c, 150, 470, 620, 300, 6), BOX.glass);
  shape(c, () => polyP(c, [[150, 470], [770, 470], [770, 520], [150, 520]]), BOX.mid);
  shape(c, end, BOX.dk);
  shape(c, top, BOX.top);
  line(c, [[280, 380], [900, 380]], 6);
  shape(c, () => ell(c, 835, 575, 26, 36), DARK, 6);
  shine(c, [[810, 485], [850, 462]], 7);
};

// setup.e1.1
const su_e1_1 = (c: Ctx) => {
  ground(c);
  shadow(c, 700, 835, 340, 36);
  // the child at the left, in side view, eye pressed to the hole
  shape(c, () => rrect(c, 40, 790, 300, 270, 60), CLOTH.child);
  shape(c, () => rrect(c, 130, 720, 100, 110, 20), SKIN.childDk);
  // the box: the end face (with the hole) turns to the child
  const end = () => polyP(c, [[430, 540], [310, 460], [310, 720], [430, 800]]);
  shape(c, () => polyP(c, [[430, 540], [930, 540], [810, 460], [310, 460]]), BOX.top);
  shape(c, () => rrect(c, 430, 540, 500, 260, 6), BOX.dk);
  shape(c, () => polyP(c, [[430, 540], [930, 540], [930, 585], [430, 585]]), BOX.mid);
  shape(c, end, BOX.mid);
  shape(c, () => ell(c, 372, 630, 22, 34), DARK, 6);
  // head in profile, facing right
  shape(c, () => ell(c, 215, 615, 135, 165), SKIN.child);
  shade(c, () => ell(c, 215, 615, 135, 165), SKIN.childDk, -26, -10, 0.6);
  c.save(); c.beginPath(); ell(c, 215, 615, 135, 165); c.clip();
  shape(c, () => ell(c, 160, 468, 175, 100), CLOTH.hair, 0); c.restore();
  shape(c, () => ell(c, 215, 615, 135, 165), "rgba(0,0,0,0)", 6);
  shape(c, () => ell(c, 100, 470, 52, 48), CLOTH.hair, 5);
  shape(c, () => ell(c, 175, 650, 26, 40), SKIN.child, 5);
  // nose beside the hole, mouth
  shape(c, () => { c.moveTo(338, 652); c.quadraticCurveTo(372, 676, 340, 700); c.closePath(); }, SKIN.child, 5);
  line(c, [[318, 735], [340, 731]], 5);
  // the eye right at the hole
  shape(c, () => ell(c, 352, 618, 24, 21), WHITE, 5);
  shape(c, () => ell(c, 360, 618, 13, 13), COL.soilDk, 0);
  shape(c, () => ell(c, 362, 618, 7, 7), DARK, 0);
  line(c, [[326, 596], [352, 588], [376, 598]], 6);
  // thought: a completely black cloud
  shape(c, () => ell(c, 290, 420, 14, 14), WHITE, 5);
  shape(c, () => ell(c, 340, 350, 24, 24), WHITE, 5);
  const cloud: [number, number, number][] = [[470, 240, 85], [590, 170, 105], [715, 235, 90], [640, 300, 85], [520, 310, 70]];
  cloud.forEach(([x, y, r]) => { c.beginPath(); ell(c, x, y, r, r); c.lineWidth = 12; c.strokeStyle = INK; c.stroke(); });
  cloud.forEach(([x, y, r]) => { c.beginPath(); ell(c, x, y, r, r); c.fillStyle = DARK; c.fill(); });
};

// setup.e1.2
const su_e1_2 = (c: Ctx) => {
  ground(c);
  shadow(c, 470, 818, 400, 34);
  // the box seen from the front, cut open to show inside: dark inside, the three things dim
  shape(c, () => rrect(c, 150, 520, 630, 270, 6), "#2f2740");
  boxThings(c, 180, 765);
  c.fillStyle = "rgba(25,20,48,0.55)"; c.fillRect(153, 523, 624, 264);
  // the thin wedge of light from the crack, falling on the paper
  c.beginPath(); polyP(c, [[600, 523], [777, 523], [725, 765], [545, 765]]); c.fillStyle = "rgba(255,232,120,0.85)"; c.fill();
  shape(c, () => polyP(c, [[590, 765], [705, 765], [694, 630], [578, 630]]), WHITE);
  c.beginPath(); polyP(c, [[590, 765], [705, 765], [694, 630], [578, 630]]); c.fillStyle = "rgba(255,226,110,0.45)"; c.fill();
  shape(c, () => rrect(c, 150, 520, 630, 270, 6), "rgba(0,0,0,0)");
  // the lid, hinged at the left, one corner lifted
  shape(c, () => polyP(c, [[130, 520], [850, 440], [858, 380], [138, 460]]), BOX.top);
  shade(c, () => polyP(c, [[130, 520], [850, 440], [858, 380], [138, 460]]), BOX.dk, -8, -6, 0.5);
  // a few rays at the crack
  for (const [x, y] of [[640, 490], [700, 478], [760, 468]]) line(c, [[x, y + 6], [x - 14, y + 34]], 6, COL.yellow);
  arrow(c, [[660, 385], [660, 285]], RED, 12);
  arm(c, 955, 410, 1, 0);
  handLeft(c, 955, 410, 0.05, 1.5);
};

// the pupil card: black circles 2 to 8 mm on a paper strip
const pupilCard = (c: Ctx, x0: number, y0: number, w: number, h: number, mmPx: number, labels: boolean) => {
  shape(c, () => rrect(c, x0 + 10, y0 + 14, w, h, 18), "rgba(43,35,64,0.16)", 0);
  shape(c, () => rrect(c, x0, y0, w, h, 18), COL.paper);
  const gap = (w - 35 * mmPx) / 8; let x = x0 + gap;
  for (let mm = 2; mm <= 8; mm++) {
    const d = mm * mmPx; x += d / 2;
    shape(c, () => ell(c, x, y0 + h * (labels ? 0.42 : 0.5), d / 2, d / 2), DARK, 4);
    if (labels) write(c, `${mm}mm`, x - 30, y0 + h * 0.74, 30, INK, 5);
    x += d / 2 + gap;
  }
};

// setup.e2.0
const su_e2_0 = (c: Ctx) => {
  ground(c);
  pupilCard(c, 40, 260, 1000, 380, 16, true);
  // a pencil lying below
  c.save(); c.translate(250, 850); c.rotate(-0.04);
  shadow(c, 300, 44, 340, 14);
  shape(c, () => polyP(c, [[-110, 0], [0, -28], [0, 28]]), COL.wood);
  shape(c, () => polyP(c, [[-110, 0], [-76, -9], [-76, 9]]), INK, 0);
  shape(c, () => rrect(c, 0, -28, 520, 56, 6), COL.yellow);
  shade(c, () => rrect(c, 0, -28, 520, 56, 6), COL.orange, -10, -12, 0.55);
  shape(c, () => rrect(c, 520, -28, 60, 56, 4), COL.steel);
  shape(c, () => rrect(c, 580, -28, 60, 56, 14), COL.pink);
  c.restore();
};

// a child's face, front view; pupil = pupil radius, look = how far the eyes turn
const kidFace = (c: Ctx, cx: number, cy: number, pupil: number, look: [number, number] = [0, 0]) => {
  shape(c, () => rrect(c, cx - 60, cy + 230, 120, 90, 20), SKIN.childDk);
  shape(c, () => rrect(c, cx - 210, cy + 275, 420, 365, 60), CLOTH.child);
  shape(c, () => ell(c, cx - 250, cy + 20, 32, 52), SKIN.child, 5);
  shape(c, () => ell(c, cx + 250, cy + 20, 32, 52), SKIN.child, 5);
  const head = () => ell(c, cx, cy, 250, 290);
  shape(c, head, SKIN.child);
  shade(c, head, SKIN.childDk, -30, -14, 0.6);
  c.save(); c.beginPath(); head(); c.clip(); shape(c, () => ell(c, cx, cy - 265, 275, 150), CLOTH.hair, 0); c.restore();
  shape(c, head, "rgba(0,0,0,0)", 6);
  for (const s of [-1, 1]) {
    const x = cx + s * 92, y = cy - 30;
    const lid = () => { c.moveTo(x - 56, y); c.quadraticCurveTo(x, y - 84, x + 56, y); c.quadraticCurveTo(x, y + 84, x - 56, y); c.closePath(); };
    shape(c, lid, WHITE, 5);
    c.save(); c.beginPath(); lid(); c.clip();
    shape(c, () => ell(c, x + look[0], y + look[1], 36, 36), COL.brown, 0);
    shape(c, () => ell(c, x + look[0], y + look[1], pupil, pupil), DARK, 0);
    shape(c, () => ell(c, x + look[0] - 10, y + look[1] - 12, 7, 7), WHITE, 0);
    c.restore();
    shape(c, lid, "rgba(0,0,0,0)", 5);
    line(c, [[x - 52, y - 68], [x, y - 82], [x + 52, y - 66]], 10, CLOTH.hair);
  }
  line(c, [[cx - 12, cy + 40], [cx + 4, cy + 62], [cx + 20, cy + 52]], 6, SKIN.childDk);
  c.beginPath(); c.arc(cx, cy + 150, 62, 0.3, Math.PI - 0.3); c.strokeStyle = INK; c.lineWidth = 7; c.lineCap = "round"; c.stroke();
};

// setup.e2.1
const su_e2_1 = (c: Ctx) => {
  c.fillStyle = "#2a2848"; c.fillRect(0, 0, 1080, 1080);
  kidFace(c, 680, 390, 31);
  c.fillStyle = "rgba(20,20,60,0.3)"; c.fillRect(0, 0, 1080, 1080);
  // the grown-up's hand holds the card under the eye: the matching circle sits under the left eye
  arm(c, 150, 515, -1, 0);
  pupilCard(c, 232, 470, 654, 90, 10, false);
  hand(c, 150, 515, 0, 1.4, SKIN.adult, CLOTH.adult);
  arrow(c, [[772, 415], [772, 462]], RED, 9);
};

// setup.e2.2
const su_e2_2 = (c: Ctx) => {
  c.fillStyle = "#fff0b8"; c.fillRect(0, 0, 1080, 1080);
  c.beginPath(); ell(c, 940, 390, 150, 190); c.fillStyle = "rgba(255,230,120,0.35)"; c.fill();
  kidFace(c, 560, 400, 11, [-8, 6]);
  // the lamp beside them, on, with rays
  shadow(c, 1000, 905, 80, 16);
  shape(c, () => ell(c, 990, 880, 70, 20), COL.tealDk);
  shape(c, () => rrect(c, 980, 500, 22, 380, 8), COL.teal);
  shape(c, () => polyP(c, [[1050, 300], [1050, 470], [930, 520], [930, 250]]), COL.teal);
  shade(c, () => polyP(c, [[1050, 300], [1050, 470], [930, 520], [930, 250]]), COL.tealDk, -14, -10, 0.55);
  shape(c, () => ell(c, 930, 385, 24, 135), COL.yellow);
  for (const y of [300, 385, 470]) line(c, [[900, y], [858, y]], 8, COL.orange);
  // the hand mirror at the lower left, the small pupil in it
  line(c, [[190, 820], [190, 900]], 40, INK); line(c, [[190, 820], [190, 900]], 26, COL.steel);
  shape(c, () => ell(c, 190, 700, 140, 140), COL.steel);
  shape(c, () => ell(c, 190, 700, 112, 112), COL.sky, 5);
  c.save(); c.beginPath(); ell(c, 190, 700, 112, 112); c.clip();
  const lid = () => { c.moveTo(120, 705); c.quadraticCurveTo(190, 630, 260, 705); c.quadraticCurveTo(190, 780, 120, 705); c.closePath(); };
  shape(c, lid, WHITE, 5);
  c.save(); c.beginPath(); lid(); c.clip(); shape(c, () => ell(c, 190, 705, 36, 36), COL.soil, 0); shape(c, () => ell(c, 190, 705, 11, 11), DARK, 0); c.restore();
  shape(c, lid, "rgba(0,0,0,0)", 5);
  shine(c, [[110, 640], [150, 612]], 9);
  c.restore();
  arm(c, 190, 970, 0, 1, CLOTH.child);
  hand(c, 190, 970, -Math.PI / 2, 1.25);
};

// ------------------------------------------------------------- the dark room with the toy elephant
const TOY_X = 300, TABLE_Y = 830, ES = 1.4, HALF = 0.5;
const LIT = { body: "#9db2d8", dk: "#6f86b8", ear: "#8aa0cc" }, UNLIT = { body: "#3b4466", dk: "#2b3252", ear: "#333b5c" };

const elephant = (c: Ctx, lit: boolean) => {
  const t = lit ? LIT : UNLIT;
  c.save(); c.translate(TOY_X, TABLE_Y); c.scale(ES, ES);
  shadow(c, 22, 4, 150, 14);
  for (const lx of [-80, -30]) shape(c, () => rrect(c, lx - 18, -72, 36, 72, 10), t.dk);
  line(c, [[-108, -140], [-140, -105], [-132, -68]], 14, INK); line(c, [[-108, -140], [-140, -105], [-132, -68]], 6, t.dk);
  shape(c, () => ell(c, 0, -130, 112, 82), t.body);
  shade(c, () => ell(c, 0, -130, 112, 82), t.dk, -26, -16, 0.7);
  for (const lx of [30, 80]) shape(c, () => rrect(c, lx - 18, -72, 36, 72, 10), t.body);
  line(c, [[150, -130], [192, -85], [170, -38]], 48, INK); line(c, [[150, -130], [192, -85], [170, -38]], 36, t.body);
  shape(c, () => ell(c, 112, -150, 62, 62), t.body);
  shape(c, () => ell(c, 80, -140, 40, 58, 0.2), t.ear);
  shape(c, () => ell(c, 135, -165, 7, 7), INK, 0);
  c.restore();
};

const HS = 1.3;
const torch = (c: Ctx, x: number, y: number, an: number) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(HS, HS);
  shape(c, () => rrect(c, -20, -30, 170, 60, 14), COL.teal);
  shape(c, () => polyP(c, [[150, -30], [205, -50], [205, 50], [150, 30]]), COL.steel);
  shape(c, () => ell(c, 207, 0, 10, 46), COL.yellow);
  c.restore();
};

const AN = 1.29, WRIST: [number, number] = [165, 71];
const LENS: [number, number] = [WRIST[0] + Math.cos(AN) * 207 * HS, WRIST[1] + Math.sin(AN) * 207 * HS];
const ray = (an: number): [number, number] => { const t = (TABLE_Y - LENS[1]) / Math.sin(an); return [LENS[0] + Math.cos(an) * t, TABLE_Y]; };

const room = (c: Ctx) => {
  c.fillStyle = "#1d1b3a"; c.fillRect(0, 0, 1080, 1080);
  c.fillStyle = "#16142e"; c.fillRect(0, 1000, 1080, 80);
  shadow(c, 400, 1006, 330, 18);
  for (const x of [120, 600]) shape(c, () => rrect(c, x, 860, 40, 140, 8), COL.woodDk);
  shape(c, () => rrect(c, 60, TABLE_Y, 660, 50, 10), COL.wood);
  c.save(); c.translate(960, 0); c.scale(-1, 1); person(c, 0, 1000, 600, { sit: true }); c.restore();
  c.fillStyle = "rgba(15,12,40,0.45)"; c.fillRect(0, 0, 1080, 1080);
};

const beam = (c: Ctx, pts: number[][]) => {
  c.beginPath(); polyP(c, pts); c.fillStyle = "rgba(255,226,120,0.40)"; c.fill();
};

const torchAndHand = (c: Ctx) => {
  arm(c, WRIST[0], WRIST[1], -Math.cos(AN), -Math.sin(AN));
  torch(c, WRIST[0], WRIST[1], AN);
  hand(c, WRIST[0], WRIST[1], AN, HS, SKIN.adult, CLOTH.adult);
};

// setup.e3.0
const su_e3_0 = (c: Ctx) => {
  room(c);
  beam(c, [LENS, ray(AN + HALF), ray(AN - HALF)]);
  elephant(c, true);
  torchAndHand(c);
};

// a card seen as a sheet: long edge A to B, depth d
const sheet = (c: Ctx, a: number[], b: number[], d: number[]) => {
  shape(c, () => polyP(c, [a, b, [b[0] + d[0], b[1] + d[1]], [a[0] + d[0], a[1] + d[1]]]), WHITE);
  shade(c, () => polyP(c, [a, b, [b[0] + d[0], b[1] + d[1]], [a[0] + d[0], a[1] + d[1]]]), COL.grey, -10, -8, 0.5);
};

// setup.e3.1
const su_e3_1 = (c: Ctx) => {
  room(c);
  beam(c, [LENS, ray(AN + HALF), ray(AN - HALF)]);
  elephant(c, true);
  torchAndHand(c);
  arm(c, 793, 495, 0, -1);
  sheet(c, [760, 590], [760, 820], [80, -40]);
  hand(c, 793, 495, Math.PI / 2, 1.2, SKIN.adult, CLOTH.adult);
};

// setup.e3.2
const su_e3_2 = (c: Ctx) => {
  room(c);
  const D = 170, cx = LENS[0] + Math.cos(AN) * D, cy = LENS[1] + Math.sin(AN) * D, px = -Math.sin(AN), py = Math.cos(AN);
  const e1 = [cx - px * 112, cy - py * 112], e2 = [cx + px * 112, cy + py * 112];
  const hit = (an: number) => [LENS[0] + (Math.cos(an) * D) / Math.cos(HALF), LENS[1] + (Math.sin(an) * D) / Math.cos(HALF)];
  const h1 = hit(AN - HALF), h2 = hit(AN + HALF);
  beam(c, [LENS, h1, h2]);
  const far = (p: number[], an: number) => { const t = (TABLE_Y - p[1]) / Math.sin(an); return [p[0] + Math.cos(an) * t, TABLE_Y]; };
  c.beginPath(); polyP(c, [h1, far(h1, AN - HALF), far(h2, AN + HALF), h2]); c.fillStyle = "rgba(10,8,30,0.35)"; c.fill();
  elephant(c, false);
  torchAndHand(c);
  const wx = e1[0] + 120, wy = e1[1] - 45;
  arm(c, wx, wy, 0.94, -0.34);
  sheet(c, e1, e2, [20, -100]);
  handLeft(c, wx, wy, 0.25, 1.2);
};

export const su_lightHowWeSee = cards("sci.light.how-we-see.L3 set-up", [su_e1_0, su_e1_1, su_e1_2, su_e2_0, su_e2_1, su_e2_2, su_e3_0, su_e3_1, su_e3_2]);
