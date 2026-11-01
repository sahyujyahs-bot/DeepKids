import type { Ctx } from "./core";
import {
  INK, WHITE, RED, COL, SKIN, CLOTH, rnd, ground, shape, ell, rrect, polyP, shadow, shade, line, arrow, plate, hand, person, write, cards,
} from "./flatKit";

// sci.india.national-identity.L3 · set-up cards: atta paw print test, anthem clock.
const ATTA = "#f3e4c4", ATTA_DK = "#dcc79b", DAMP = "#c7a56e", DAMP_DK = "#a78650", DENT = "#b89b68";

// a plate of atta seen at an angle; damp = darker and crumbly, dry = smooth with soft swirls
const attaPlate = (c: Ctx, x: number, y: number, rx: number, ry: number, damp: boolean, seedNo = 3) => {
  plate(c, x, y, rx, ry);
  const ar = rx * 0.82, br = ry * 0.78, body = () => ell(c, x, y - 2, ar, br);
  shape(c, body, damp ? DAMP : ATTA, 5);
  shade(c, body, damp ? DAMP_DK : ATTA_DK, ar * 0.25, br * 0.25, 0.6);
  if (damp) {
    const r = rnd(seedNo);
    for (let i = 0; i < 46; i++) {
      const a = r() * 6.28, d = Math.sqrt(r()) * 0.86, cx = x + Math.cos(a) * ar * d, cy = y - 2 + Math.sin(a) * br * d, cr = 11 + r() * 12;
      shape(c, () => ell(c, cx, cy, cr, cr * 0.75, r() * 3), r() > 0.5 ? "#d6b783" : "#b8955c", 3);
    }
  } else {
    for (const k of [0.35, 0.6]) { c.beginPath(); c.ellipse(x, y - 2, ar * k, br * k, 0, 0.3, 4.2); c.strokeStyle = ATTA_DK; c.lineWidth = 5; c.lineCap = "round"; c.stroke(); }
  }
};
const drop = (c: Ctx, x: number, y: number, s: number) => {
  shape(c, () => { c.moveTo(x, y - 1.1 * s); c.quadraticCurveTo(x - 0.15 * s, y - 0.5 * s, x - 0.6 * s, y); c.arc(x, y, 0.6 * s, Math.PI, 0, true); c.quadraticCurveTo(x + 0.15 * s, y - 0.5 * s, x, y - 1.1 * s); c.closePath(); }, COL.water, 6);
  line(c, [[x - 0.28 * s, y + 0.05 * s], [x - 0.18 * s, y + 0.3 * s]], 7, WHITE);
};
// a wooden ruler, left end at (x, y), top edge y; zero at x0; px per cm; ticks to maxCm
const ruler = (c: Ctx, x: number, y: number, w: number, h: number, x0: number, pxCm: number, maxCm: number, ticksUp = false) => {
  shape(c, () => rrect(c, x, y, w, h, 8), COL.wood, 6);
  shade(c, () => rrect(c, x, y, w, h, 8), COL.woodDk, 0, 10, 0.5);
  const base = ticksUp ? y + h : y;
  for (let k = 0; k <= maxCm * 2; k++) {
    const tx = x0 + (k * pxCm) / 2, big = k % 2 === 0, len = big ? 36 : 22, dir = ticksUp ? -1 : 1;
    line(c, [[tx, base], [tx, base + dir * len]], big ? 5 : 3.5);
    if (big) write(c, String(k / 2), tx - 9, ticksUp ? y + 6 : y + h - 32, 26, INK, 4.5);
  }
};

// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c);
  attaPlate(c, 270, 690, 250, 210, false);
  attaPlate(c, 810, 690, 250, 210, true);
  // ruler resting across the dry atta
  shadow(c, 290, 700, 255, 26);
  ruler(c, 20, 575, 520, 70, 50, 50, 9);
  drop(c, 810, 330, 90);
  drop(c, 925, 420, 44);
  drop(c, 695, 420, 44);
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c);
  attaPlate(c, 540, 820, 470, 190, false);
  const xs = [432, 504, 576, 648];
  xs.forEach((x) => shape(c, () => ell(c, x, 812, 40, 24), DENT, 4));
  shadow(c, 570, 830, 190, 36);
  // sleeve and the back of the hand
  shape(c, () => rrect(c, 410, -40, 260, 380, 20), CLOTH.child, 6);
  shade(c, () => rrect(c, 410, -40, 260, 380, 20), CLOTH.childDk, 60, 0, 0.55);
  const back = () => rrect(c, 395, 300, 290, 270, 60);
  shape(c, back, SKIN.child, 6);
  shade(c, back, SKIN.childDk, 40, 20, 0.55);
  // four finger backs rolled down, pressing in
  xs.forEach((x, i) => {
    const f = () => rrect(c, x - 35, 520, 70, 292 - (i === 0 || i === 3 ? 12 : 0), 34);
    shape(c, f, SKIN.child, 6);
    shade(c, f, SKIN.childDk, 12, 0, 0.55);
  });
  shape(c, () => ell(c, 690, 520, 34, 80, 0.5), SKIN.child, 6);
  arrow(c, [[250, 280], [250, 640]], RED, 14);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c);
  attaPlate(c, 540, 810, 500, 200, false);
  const xs = [282, 430, 578, 726];
  xs.forEach((x) => { shape(c, () => ell(c, x, 800, 50, 30), DENT, 5); shade(c, () => ell(c, x, 800, 50, 30), DAMP_DK, 14, 10, 0.5); });
  // guide lines from the two outer marks up to the ruler
  for (const gx of [234, 774]) { c.setLineDash([16, 14]); line(c, [[gx, 790], [gx, 480]], 5, RED); c.setLineDash([]); }
  shadow(c, 620, 560, 400, 22);
  ruler(c, 190, 405, 820, 70, 234, 90, 7, true);
  // the child's hand holds the ruler's end
  shape(c, () => rrect(c, 858, -30, 144, 290, 10), CLOTH.child, 6);
  hand(c, 930, 300, Math.PI / 2, 2);
};

// a mouth open in song; the person's head sits at known spots
const sing = (c: Ctx, x: number, y: number, h: number) => {
  const head = h * 0.13, hy = y - h * 0.74 - head * 1.05;
  shape(c, () => ell(c, x, hy + head * 0.5, head * 0.3, head * 0.27), "#7a2f3a", 4);
};
const note = (c: Ctx, x: number, y: number, s: number, col: string) => {
  line(c, [[x + s * 0.5, y], [x + s * 0.5, y - s * 1.8], [x + s * 1.2, y - s * 1.4]], s * 0.2, INK);
  shape(c, () => ell(c, x, y, s * 0.55, s * 0.4, -0.4), col, 5);
};
// min:sec on a phone screen, drawn as strokes
const clock = (c: Ctx, t: string, x: number, y: number, h: number) => {
  write(c, t[0], x, y, h, WHITE, 7);
  c.fillStyle = WHITE; for (const dy of [0.3, 0.7]) { c.beginPath(); c.arc(x + h * 0.95, y + h * dy, 5, 0, 6.3); c.fill(); }
  write(c, t.slice(1), x + h * 1.2, y, h, WHITE, 7);
};
const phone = (c: Ctx, x: number, y: number, w: number, h: number, t: string) => {
  const body = () => rrect(c, x - w / 2, y - h / 2, w, h, 26);
  shape(c, body, COL.black, 6);
  shape(c, () => rrect(c, x - w / 2 + 12, y - h / 2 + 16, w - 24, h - 32, 14), "#22303a", 4);
  // stopwatch icon above the digits
  shape(c, () => ell(c, x, y - h * 0.2, w * 0.2, w * 0.2), COL.yellow, 5);
  line(c, [[x, y - h * 0.2], [x + w * 0.1, y - h * 0.26]], 5);
  line(c, [[x - 10, y - h * 0.2 - w * 0.2 - 6], [x + 10, y - h * 0.2 - w * 0.2 - 6]], 6);
  const th = w * 0.27;
  clock(c, t, x - th * 1.55, y + h * 0.1, th);
};

// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c);
  const gx = 300, gy = 985, gh = 660, mx = 790, my = 985, mh = 760;
  shadow(c, gx + 20, gy + 8, 150, 26); shadow(c, mx + 20, my + 8, 170, 26);
  person(c, gx, gy, gh);
  sing(c, gx, gy, gh);
  person(c, mx, my, mh, { adult: true, armL: [Math.PI * 0.62, Math.PI * 1.35] });
  phone(c, 520, 340, 170, 300, "0 12");
  // the grown-up's hand round the phone's lower edge
  shape(c, () => ell(c, 545, 480, 58, 40), SKIN.adult, 6);
  shape(c, () => ell(c, 478, 440, 20, 44, 0.3), SKIN.adult, 6);
  note(c, 120, 330, 40, COL.purple); note(c, 330, 180, 46, COL.pink);
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c);
  const base = 720, ppl: [number, number, boolean][] = [[150, 560, true], [370, 430, false], [730, 560, true], [920, 430, false]];
  ppl.forEach(([x, h, ad]) => { person(c, x, base, h, { adult: ad, armL: [Math.PI * 0.55, Math.PI * 0.5], armR: [Math.PI * 0.45, Math.PI * 0.5] }); sing(c, x, base, h); });
  note(c, 270, 230, 38, COL.purple); note(c, 540, 170, 44, COL.pink); note(c, 830, 230, 38, COL.teal);
  // the table in front, with the phone standing on it
  shape(c, () => polyP(c, [[0, 700], [1080, 700], [1080, 930], [0, 930]]), COL.wood, 6);
  shape(c, () => polyP(c, [[0, 930], [1080, 930], [1080, 1090], [0, 1090]]), COL.woodDk, 6);
  shadow(c, 570, 905, 130, 20);
  phone(c, 550, 740, 200, 340, "0 53");
};

export const su_indiaNationalIdentity = cards("sci.india.national-identity.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1]);
