import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, RED, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, person, write, leaf, cards } from "./flatKit";

// sci.day-night-seasons.rhythms-of-nature.L3 cards. Same child and grown-up as the set-up cards.
// Sun = yellow disc with orange rays, moon = pale crescent, night = deep blue, day = light sky.

const NIGHT = "#2f3a6e", NIGHT_DK = "#232c58", DAY = "#cfe9f7", SUN = "#ffd34d", MOON = "#f6efc9", MOON_DK = "#e0d7a4";
const POT = "#d9784a", POT_DK = "#b25a30", PAGE = "#fffaf0";

const arc = (cx: number, cy: number, r: number, a0: number, a1: number, n = 16) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });
const panel = (c: Ctx, x: number, y: number, w: number, h: number, col: string) => shape(c, () => rrect(c, x, y, w, h, 28), col, 6);
const clipPanel = (c: Ctx, x: number, y: number, w: number, h: number, col: string, inside: () => void) => {
  panel(c, x, y, w, h, col); c.save(); c.beginPath(); rrect(c, x, y, w, h, 28); c.clip(); inside(); c.restore(); c.beginPath(); rrect(c, x, y, w, h, 28); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.7, y + Math.sin(a) * r * 1.7]], Math.max(4, r * 0.12), COL.orange); }
  shape(c, () => ell(c, x, y, r, r), SUN, Math.max(4, r * 0.07)); shade(c, () => ell(c, x, y, r, r), COL.orange, r * 0.25, r * 0.25, 0.35);
};
// a crescent opening to the right, centre (x, y), radius R
const moon = (c: Ctx, x: number, y: number, R: number) => {
  const d = R * 0.5, r = R * 0.85, x0 = (d * d + R * R - r * r) / (2 * d), y0 = Math.sqrt(R * R - x0 * x0);
  const a1 = Math.atan2(-y0, x0), a2 = Math.atan2(y0, x0), b1 = Math.atan2(-y0, x0 - d), b2 = Math.atan2(y0, x0 - d);
  shape(c, () => { c.arc(x, y, R, a1, a2, true); c.arc(x + d, y, r, b2, b1, false); c.closePath(); }, MOON, Math.max(4, R * 0.07));
};
const star = (c: Ctx, x: number, y: number, r: number) => { shape(c, () => polyP(c, [[x, y - r], [x + r * 0.3, y - r * 0.3], [x + r, y], [x + r * 0.3, y + r * 0.3], [x, y + r], [x - r * 0.3, y + r * 0.3], [x - r, y], [x - r * 0.3, y - r * 0.3]]), SUN, 3); };
const stars = (c: Ctx, seed: number, n: number, x0: number, y0: number, w: number, h: number) => { const r = rnd(seed); for (let i = 0; i < n; i++) star(c, x0 + r() * w, y0 + r() * h, 9 + r() * 7); };
const clock = (c: Ctx, x: number, y: number, r: number, hr: number, mn: number, face: string = WHITE) => {
  shape(c, () => ell(c, x, y, r, r), face, Math.max(4, r * 0.08));
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[x + Math.sin(a) * r * 0.82, y - Math.cos(a) * r * 0.82], [x + Math.sin(a) * r * 0.92, y - Math.cos(a) * r * 0.92]], Math.max(3, r * 0.05)); }
  line(c, [[x, y], [x + Math.sin(hr) * r * 0.5, y - Math.cos(hr) * r * 0.5]], Math.max(5, r * 0.1)); line(c, [[x, y], [x + Math.sin(mn) * r * 0.75, y - Math.cos(mn) * r * 0.75]], Math.max(4, r * 0.07));
  shape(c, () => ell(c, x, y, r * 0.08, r * 0.08), INK, 0);
};
const flower = (c: Ctx, x: number, y: number, r: number, n: number, col: string, centre: string, colDk: string) => {
  for (let i = 0; i < n; i++) { const a = (i * Math.PI * 2) / n - Math.PI / 2; shape(c, () => ell(c, x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62, r * 0.5, r * 0.3, a), col, Math.max(3, r * 0.08)); }
  shape(c, () => ell(c, x, y, r * 0.3, r * 0.3), centre, Math.max(3, r * 0.07)); void colDk;
};
const lotus = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y + r * 0.55, r * 1.4, r * 0.3), COL.leaf, 4);
  for (const a of [-1.05, 1.05, -0.5, 0.5, 0]) shape(c, () => { c.moveTo(x, y + r * 0.5); c.quadraticCurveTo(x + Math.sin(a) * r * 1.3 - r * 0.3, y - r * 0.4, x + Math.sin(a) * r * 1.1, y - r * (1.3 - Math.abs(a) * 0.4)); c.quadraticCurveTo(x + Math.sin(a) * r * 1.2 + r * 0.3, y - r * 0.2, x, y + r * 0.5); c.closePath(); }, a === 0 ? "#f7b6cc" : COL.pink, Math.max(3, r * 0.06));
};
const pot = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.12, y + 8, w * 0.6, w * 0.1);
  const body = () => polyP(c, [[x - w / 2, y - h], [x + w / 2, y - h], [x + w * 0.35, y], [x - w * 0.35, y]]);
  shape(c, body, POT); shade(c, body, POT_DK, w * 0.14, 0, 0.6);
  shape(c, () => rrect(c, x - w * 0.56, y - h - h * 0.22, w * 1.12, h * 0.26, 8), POT, 5);
  shape(c, () => ell(c, x, y - h - h * 0.1, w * 0.46, h * 0.07), COL.soil, 0);
};
// a bean seedling: stem from (x, y) up by h, two leaf pairs; up = leaves raised and spread, else hanging down
const bean = (c: Ctx, x: number, y: number, h: number, up: boolean, sw = 14) => {
  const L = h * 0.55;
  line(c, [[x, y], [x, y - h]], sw + 8, INK); line(c, [[x, y], [x, y - h]], sw, COL.green);
  for (const [fy, s] of [[0.62, 0.8], [1, 1]] as [number, number][]) for (const d of [-1, 1]) {
    const an = up ? (d < 0 ? Math.PI + 0.25 : -0.25) : (d < 0 ? Math.PI * 0.5 + 0.35 : Math.PI * 0.5 - 0.35);
    leaf(c, x, y - h * fy, L * s, an, COL.leaf);
  }
};
const bird = (c: Ctx, x: number, y: number, s: number, body: string, dk: string, dir = 1, wingUp = false) => {
  c.save(); c.translate(x, y); c.scale(s * dir, s);
  shape(c, () => polyP(c, [[-45, -4], [-100, -22], [-96, 14]]), dk, 5);
  shape(c, () => ell(c, 0, 0, 60, 38, -0.1), body, 5);
  shape(c, () => ell(c, 52, -30, 28, 27), body, 5);
  shape(c, () => polyP(c, [[76, -34], [104, -24], [76, -20]]), COL.orange, 4);
  shape(c, () => ell(c, 58, -34, 5, 5), INK, 0);
  shape(c, () => (wingUp ? polyP(c, [[-30, -10], [10, -70], [40, -4]]) : ell(c, -8, 6, 38, 20, 0.35)), dk, 5);
  c.restore();
};
const window_ = (c: Ctx, x: number, y: number, w: number, h: number, inside: () => void) => {
  shape(c, () => rrect(c, x - 26, y - 26, w + 52, h + 52, 14), COL.wood, 6);
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); inside(); c.restore();
  c.beginPath(); c.rect(x, y, w, h); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
  line(c, [[x + w / 2, y], [x + w / 2, y + h]], 12, COL.woodDk); line(c, [[x, y + h / 2], [x + w, y + h / 2]], 12, COL.woodDk);
  shape(c, () => rrect(c, x - 44, y + h + 24, w + 88, 30, 8), COL.woodDk, 6);
};
const zz = (c: Ctx, x: number, y: number, s: number) => line(c, [[x, y], [x + s, y], [x, y + s], [x + s, y + s]], Math.max(4, s * 0.16), WHITE);
const lamp = (c: Ctx, x: number, y: number, s: number, lit: boolean) => {
  line(c, [[x, y], [x, y - 190 * s], [x + 50 * s, y - 210 * s]], 12 * s + 8, INK); line(c, [[x, y], [x, y - 190 * s], [x + 50 * s, y - 210 * s]], 12 * s, COL.greyDk);
  if (lit) { c.beginPath(); ell(c, x + 60 * s, y - 200 * s, 70 * s, 70 * s); c.fillStyle = "rgba(255,211,77,0.35)"; c.fill(); }
  shape(c, () => ell(c, x + 60 * s, y - 200 * s, 24 * s, 24 * s), lit ? SUN : COL.steel, 4);
};

// ------------------------------------------------------------------ term cards
const rhythm = (c: Ctx) => {
  ground(c);
  c.beginPath(); ell(c, 540, 540, 330, 330); c.fillStyle = "rgba(255,255,255,0.45)"; c.fill();
  arrow(c, arc(540, 540, 330, -1.0, 1.0), RED, 16); arrow(c, arc(540, 540, 330, Math.PI - 1.0, Math.PI + 1.0), RED, 16);
  sun(c, 540, 235, 85);
  shape(c, () => ell(c, 540, 845, 100, 100), NIGHT, 6); moon(c, 540, 845, 80); star(c, 650, 790, 14);
};
const dailyRhythm = (c: Ctx) => {
  ground(c);
  clipPanel(c, 40, 110, 480, 760, NIGHT, () => { stars(c, 5, 8, 80, 150, 400, 200); });
  moon(c, 280, 300, 90);
  // child asleep in bed
  shape(c, () => rrect(c, 80, 600, 400, 130, 16), COL.brown, 6); shape(c, () => rrect(c, 80, 700, 400, 70, 10), COL.wood, 6);
  shape(c, () => rrect(c, 90, 540, 150, 80, 36), WHITE, 5);
  shape(c, () => ell(c, 175, 560, 62, 56), SKIN.child, 5);
  shape(c, () => { c.moveTo(113, 556); c.bezierCurveTo(115, 495, 235, 495, 237, 556); c.quadraticCurveTo(175, 530, 113, 556); c.closePath(); }, CLOTH.hair, 5);
  line(c, [[148, 570], [164, 576]], 5); line(c, [[188, 576], [204, 570]], 5);
  shape(c, () => rrect(c, 230, 580, 250, 130, 30), COL.blue, 6); shade(c, () => rrect(c, 230, 580, 250, 130, 30), COL.blueDk, 0, 40, 0.6);
  zz(c, 270, 440, 40); zz(c, 330, 380, 30);
  clipPanel(c, 560, 110, 480, 760, DAY, () => { });
  sun(c, 800, 290, 90);
  shape(c, () => rrect(c, 560, 780, 480, 90, 0), COL.greenLt, 0);
  person(c, 800, 830, 520, { armL: [-2.3, -1.9], armR: [-0.8, -1.2] });
  arrow(c, [[300, 960], [540, 990], [780, 960]], RED, 14);
};
const bodyClock = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 930, 300, 40);
  shape(c, () => { c.moveTo(220, 930); c.quadraticCurveTo(540, 740, 860, 930); c.closePath(); }, COL.soil, 6);
  const L = 330;
  shape(c, () => rrect(c, 490, 320, 100, 520, 40), COL.green, 6);
  shade(c, () => rrect(c, 490, 320, 100, 520, 40), COL.greenDk, 30, 0, 0.5);
  leaf(c, 540, 330, L, Math.PI + 0.25, COL.leaf); leaf(c, 540, 330, L, -0.25, COL.leaf); leaf(c, 540, 400, L * 0.8, Math.PI * 0.8, COL.leaf); leaf(c, 540, 400, L * 0.8, Math.PI * 0.2, COL.leaf);
  clock(c, 540, 600, 70, 3.8, 0.4, "rgba(255,255,255,0.88)");
  arrow(c, arc(540, 600, 112, -2.2, -0.6), RED, 9);
};
const circadian = (c: Ctx) => {
  ground(c);
  const xs = [200, 400, 600, 800], ys = (x: number) => 430 - 150 * Math.cos((2 * Math.PI * (x - 200)) / 400);
  line(c, Array.from({ length: 61 }, (_, i) => { const x = 130 + (i * 820) / 60; return [x, ys(x)]; }), 22, INK);
  line(c, Array.from({ length: 61 }, (_, i) => { const x = 130 + (i * 820) / 60; return [x, ys(x)]; }), 12, COL.teal);
  xs.forEach((x, i) => { if (i % 2 === 0) sun(c, x, 760, 60); else { shape(c, () => ell(c, x, 760, 78, 78), NIGHT, 6); moon(c, x, 760, 60); } });
  [[200, 290], [600, 290]].forEach(([x, y]) => shape(c, () => ell(c, x, y, 12, 12), RED, 0));
};
const pulvinus = (c: Ctx) => {
  ground(c);
  leaf(c, 600, 380, 400, -0.55, COL.leaf);
  line(c, [[260, 960], [380, 700], [470, 520]], 36, INK); line(c, [[260, 960], [380, 700], [470, 520]], 24, COL.greenLt);
  line(c, [[470, 520], [570, 410], [600, 380]], 28, INK); line(c, [[470, 520], [570, 410], [600, 380]], 18, COL.greenLt);
  shape(c, () => ell(c, 478, 510, 52, 40, -0.9), COL.green, 6); shade(c, () => ell(c, 478, 510, 52, 40, -0.9), COL.greenDk, 14, 14, 0.5);
  c.beginPath(); ell(c, 478, 510, 112, 112); c.strokeStyle = RED; c.lineWidth = 12; c.stroke();
  arrow(c, arc(480, 480, 190, -2.9, -2.2), RED, 10);
};
const dayLength = (c: Ctx) => {
  ground(c);
  const disc = (x: number, frac: number) => {
    const y = 540, R = 215;
    shape(c, () => ell(c, x, y, R, R), NIGHT, 6);
    c.save(); c.beginPath(); ell(c, x, y, R, R); c.clip(); c.beginPath(); c.moveTo(x, y); c.arc(x, y, R + 5, -Math.PI / 2 - frac * Math.PI, -Math.PI / 2 + frac * Math.PI); c.closePath(); c.fillStyle = SUN; c.fill(); c.restore();
    c.beginPath(); ell(c, x, y, R, R); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
    line(c, [[x, y], [x, y - R]], 5); sun(c, x, y - R * 0.55, 34); moon(c, x, y + R * 0.52, 36);
  };
  disc(285, 9 / 24); disc(795, 15 / 24);
  write(c, "9", 255, 810, 90, INK, 12); write(c, "15", 700, 810, 90, INK, 12);
};
const hibernate = (c: Ctx) => {
  ground(c, "#cfe3f2");
  const r = rnd(3); for (let i = 0; i < 26; i++) { const x = r() * D, y = r() * 520; line(c, [[x - 9, y], [x + 9, y]], 4, WHITE); line(c, [[x, y - 9], [x, y + 9]], 4, WHITE); line(c, [[x - 6, y - 6], [x + 6, y + 6]], 4, WHITE); line(c, [[x + 6, y - 6], [x - 6, y + 6]], 4, WHITE); }
  shadow(c, 560, 960, 460, 40);
  const hill = () => { c.moveTo(60, 960); c.bezierCurveTo(60, 380, 380, 230, 540, 230); c.bezierCurveTo(700, 230, 1020, 380, 1020, 960); c.closePath(); };
  shape(c, hill, WHITE); shade(c, hill, "#b8cfe3", 40, 30, 0.5);
  shape(c, () => { c.moveTo(250, 960); c.bezierCurveTo(250, 520, 830, 520, 830, 960); c.closePath(); }, "#4a3a48", 6);
  // bear curled up
  shape(c, () => ell(c, 540, 840, 230, 120), "#8a5a3c", 5); shade(c, () => ell(c, 540, 840, 230, 120), "#6a4128", 30, 30, 0.5);
  shape(c, () => ell(c, 400, 790, 20, 20), "#8a5a3c", 5); shape(c, () => ell(c, 470, 755, 20, 20), "#8a5a3c", 5);
  shape(c, () => ell(c, 440, 820, 85, 75), "#a8723f", 5);
  shape(c, () => ell(c, 440, 840, 38, 28), "#e5c9a2", 4); shape(c, () => ell(c, 440, 828, 11, 8), INK, 0);
  line(c, [[390, 800], [415, 808]], 5); line(c, [[466, 808], [491, 800]], 5);
  shape(c, () => ell(c, 640, 900, 70, 40, 0.2), "#a8723f", 5);
  zz(c, 620, 640, 40); zz(c, 690, 580, 32);
};
const chronobiology = (c: Ctx) => {
  ground(c);
  clock(c, 220, 220, 100, 1.5, 3.6);
  shape(c, () => rrect(c, 700, 110, 270, 230, 14), WHITE, 6); shape(c, () => rrect(c, 700, 110, 270, 56, 14), RED, 6);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) shape(c, () => rrect(c, 722 + i * 60, 185 + j * 36, 44, 24, 5), j === 1 && i === 2 ? SUN : "#e9e4d6", 3);
  shape(c, () => rrect(c, 60, 820, 960, 60, 10), COL.wood, 6); shape(c, () => rrect(c, 120, 880, 40, 100, 4), COL.woodDk, 6); shape(c, () => rrect(c, 920, 880, 40, 100, 4), COL.woodDk, 6);
  // lamp over plant
  line(c, [[860, 820], [860, 460], [740, 400]], 20, INK); line(c, [[860, 820], [860, 460], [740, 400]], 10, COL.greyDk);
  shape(c, () => polyP(c, [[680, 400], [780, 340], [820, 420], [720, 470]]), COL.steel, 5);
  c.beginPath(); c.moveTo(715, 440); c.lineTo(560, 810); c.lineTo(840, 810); c.lineTo(780, 395); c.closePath(); c.fillStyle = "rgba(255,211,77,0.30)"; c.fill();
  pot(c, 700, 820, 190, 130); bean(c, 700, 690, 200, true, 12);
  person(c, 270, 960, 640, { adult: true, armR: [-0.3, -0.5], armL: [1.4, 1.5] });
};

// ------------------------------------------------------------------ explanation cards
const bigRhythms = (c: Ctx) => {
  ground(c);
  const cx = 540, cy = 540;
  const seg = (a0: number, a1: number, r0: number, r1: number, col: string) => shape(c, () => { c.arc(cx, cy, r1, a0, a1); c.arc(cx, cy, r0, a1, a0, true); c.closePath(); }, col, 5);
  const S = [COL.greenLt, COL.yellow, COL.water, "#e8d9b8"];
  S.forEach((col, i) => seg(-Math.PI / 2 + (i * Math.PI) / 2 + 0.02, -Math.PI / 2 + ((i + 1) * Math.PI) / 2 - 0.02, 330, 470, col));
  // season marks: flower, sun, raindrops, falling leaf
  flower(c, 690, 150, 40, 5, COL.pink, SUN, COL.pink);
  sun(c, 930, 400, 30);
  [[880, 770], [850, 830], [910, 830]].forEach(([x, y]) => shape(c, () => { c.moveTo(x, y - 24); c.quadraticCurveTo(x + 18, y + 2, x, y + 18); c.quadraticCurveTo(x - 18, y + 2, x, y - 24); c.closePath(); }, COL.blue, 4));
  leaf(c, 190, 760, 60, -0.8, COL.orange); leaf(c, 120, 600, 60, 0.6, COL.orange);
  // inner disc: day above, night below
  shape(c, () => { c.arc(cx, cy, 300, Math.PI, 0); c.closePath(); }, DAY, 6); shape(c, () => { c.arc(cx, cy, 300, 0, Math.PI); c.closePath(); }, NIGHT, 6);
  sun(c, 400, 400, 50); bird(c, 660, 380, 0.7, COL.red, "#b83f2c");
  shape(c, () => ell(c, 400, 690, 80, 80), NIGHT_DK, 0); moon(c, 400, 690, 60); star(c, 560, 650, 12); star(c, 640, 740, 14);
  shape(c, () => rrect(c, 600, 640, 170, 70, 30), COL.blue, 5); shape(c, () => ell(c, 770, 660, 36, 34), SKIN.child, 4);
  zz(c, 700, 560, 32);
  arrow(c, arc(cx, cy, 400, -0.35, 0.3), RED, 12);
};
const darkBoxBean = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 160, 160, 760, 700, 26), "#3a3550", 8);
  shape(c, () => rrect(c, 160, 130, 760, 60, 14), "#554e72", 8);
  // faint view of the plant inside
  c.beginPath(); ell(c, 540, 540, 300, 280); c.fillStyle = "rgba(255,255,255,0.08)"; c.fill();
  pot(c, 540, 840, 180, 120);
  bean(c, 540, 720, 300, true, 14);
  clock(c, 540, 640, 54, 3.8, 0.4, "rgba(255,255,255,0.85)");
  // sun outside with no way in
  sun(c, 990, 120, 40); line(c, [[935, 70], [1045, 170]], 10, RED);
  arrow(c, arc(540, 520, 330, -2.4, -1.6), RED, 12);
};
const preDawn = (c: Ctx) => {
  ground(c);
  window_(c, 190, 120, 700, 640, () => {
    const g = c.createLinearGradient(0, 120, 0, 760); g.addColorStop(0, "#26306a"); g.addColorStop(0.6, "#5b6fb5"); g.addColorStop(1, "#f6a05a");
    c.fillStyle = g; c.fillRect(190, 120, 700, 640);
    stars(c, 11, 6, 220, 150, 640, 200);
    shape(c, () => { c.moveTo(190, 760); c.lineTo(190, 640); c.bezierCurveTo(360, 590, 540, 700, 890, 610); c.lineTo(890, 760); c.closePath(); }, "#2f4a4a", 6);
    c.beginPath(); ell(c, 540, 700, 250, 70); c.fillStyle = "rgba(255,200,120,0.35)"; c.fill();
  });
  bean(c, 540, 810, 330, true, 16);
  shape(c, () => rrect(c, 470, 796, 140, 20, 6), POT, 5);
  arrow(c, [[340, 700], [300, 600], [310, 520]], RED, 12); arrow(c, [[740, 700], [780, 600], [770, 520]], RED, 12);
};
const rainTree = (c: Ctx) => {
  ground(c);
  const twig = (x: number, open: boolean) => {
    line(c, [[x, 960], [x, 160]], 22, INK); line(c, [[x, 960], [x, 160]], 10, COL.brown);
    for (let i = 0; i < 7; i++) {
      const y = 860 - i * 100;
      for (const d of [-1, 1]) {
        const lx = open ? x + d * 90 : x + d * 24, ly = open ? y - 8 : y + 50, rx = open ? 85 : 20, ry = open ? 26 : 62;
        shape(c, () => ell(c, lx, ly, rx, ry, open ? d * -0.12 : 0), open ? COL.leaf : COL.leafDk, 5);
      }
    }
  };
  clipPanel(c, 30, 60, 480, 960, "#d98a63", () => { }); sun(c, 270, 150, 0.01);
  clipPanel(c, 570, 60, 480, 960, DAY, () => { });
  shape(c, () => ell(c, 120, 140, 50, 50), "#7a4a6a", 0); moon(c, 120, 140, 42);
  sun(c, 960, 140, 44);
  twig(270, false); twig(810, true);
};
const flowerClock = (c: Ctx, withKit: boolean) => {
  ground(c);
  const cx = 540, cy = 520, R = 400;
  shadow(c, cx + 20, cy + R * 0.95, R, 50);
  shape(c, () => ell(c, cx, cy, R, R), PAGE, 6);
  shape(c, () => { c.arc(cx, cy, R - 24, Math.PI, 0); c.closePath(); }, DAY, 4);
  shape(c, () => { c.arc(cx, cy, R - 24, 0, Math.PI); c.closePath(); }, NIGHT, 4);
  sun(c, cx, cy - 290, 46); shape(c, () => ell(c, cx, cy + 290, 52, 52), NIGHT_DK, 0); moon(c, cx, cy + 290, 44);
  lotus(c, cx - 250, cy - 20, 44);
  flower(c, cx + 245, cy - 40, 70, 5, "#d6338a", SUN, "");
  flower(c, cx + 170, cy + 180, 52, 5, WHITE, SUN, "");
  flower(c, cx - 170, cy + 190, 52, 6, WHITE, COL.orange, "");
  star(c, cx - 70, cy + 120, 11); star(c, cx + 60, cy + 90, 9);
  if (withKit) {
    shape(c, () => polyP(c, [[cx - 14, cy], [cx - 220, cy - 8], [cx - 220, cy - 36], [cx - 290, cy], [cx - 220, cy + 36], [cx - 220, cy + 8], [cx - 14, cy + 14]]), RED, 6);
    shape(c, () => ell(c, cx, cy, 24, 24), COL.steel, 5);
    arrow(c, arc(cx, cy, 130, -2.6, -0.9), RED, 10);
    for (const [x, col] of [[110, COL.red], [175, COL.blue], [240, COL.green]] as [number, string][]) { const q = () => polyP(c, [[x, 1010], [x + 36, 1010], [x + 36, 900], [x, 900]]); shape(c, q, col, 5); shape(c, () => polyP(c, [[x, 900], [x + 36, 900], [x + 18, 860]]), "#f2d1a5", 5); }
  }
};
const warbler = (c: Ctx) => {
  ground(c, NIGHT);
  stars(c, 21, 10, 40, 40, 1000, 260); moon(c, 920, 150, 70);
  [[190, 330, 0.55], [430, 250, 0.5], [670, 330, 0.45]].forEach(([x, y, s]) => bird(c, x, y, s, NIGHT_DK, "#161c3e", 1, true));
  arrow(c, [[160, 450], [600, 450], [860, 450]], RED, 12);
  // cage
  shadow(c, 540, 960, 300, 36);
  shape(c, () => rrect(c, 230, 880, 620, 60, 14), COL.woodDk, 6);
  c.beginPath(); c.moveTo(250, 880); c.lineTo(250, 640); c.bezierCurveTo(250, 440, 830, 440, 830, 640); c.lineTo(830, 880); c.closePath(); c.fillStyle = "rgba(220,235,250,0.14)"; c.fill();
  for (let i = 0; i < 9; i++) { const x = 250 + i * 72.5, top = 640 - Math.sin((i / 8) * Math.PI) * 140; line(c, [[x, 880], [x, top + 18]], 8, COL.steel); }
  bird(c, 540, 760, 0.95, COL.brown, COL.woodDk, 1, true);
  c.beginPath(); c.moveTo(250, 880); c.lineTo(250, 640); c.bezierCurveTo(250, 440, 830, 440, 830, 640); c.lineTo(830, 880); c.strokeStyle = COL.steelDk; c.lineWidth = 10; c.stroke();
  arrow(c, [[500, 640], [620, 640], [720, 640]], RED, 10);
};
const dayLengthPlant = (c: Ctx) => {
  ground(c);
  const rows = [0.62, 0.5, 0.38, 0.26];
  rows.forEach((f, i) => {
    const y = 140 + i * 130, w = 520;
    shape(c, () => rrect(c, 60, y, w, 90, 14), NIGHT, 5);
    c.save(); c.beginPath(); rrect(c, 60, y, w, 90, 14); c.clip(); c.fillStyle = SUN; c.fillRect(60, y, w * f, 90); c.restore();
    c.beginPath(); rrect(c, 60, y, w, 90, 14); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  });
  arrow(c, [[640, 300], [730, 300], [800, 300]], RED, 14);
  pot(c, 860, 900, 220, 150); bean(c, 860, 770, 360, true, 12);
  for (const [x, y] of [[800, 470], [920, 440], [840, 380], [900, 540]]) flower(c, x, y, 32, 5, COL.yellow, COL.orange, "");
};

// ------------------------------------------------------------------ activity / experiment cards
const warmCool = (c: Ctx) => {
  ground(c);
  const cols: [number, number, number, () => void][] = [
    [190, 0.3, 0, () => { }], [540, 0.85, 1, () => { }], [890, 0.55, 2, () => { }],
  ];
  cols.forEach(([x, f, k]) => {
    panel(c, x - 160, 80, 320, 880, k === 2 ? NIGHT : DAY);
    if (k === 0) { c.save(); c.beginPath(); rrect(c, x - 160, 80, 320, 880, 28); c.clip(); sun(c, x, 260, 50); c.restore(); }
    if (k === 1) sun(c, x, 200, 56);
    if (k === 2) { moon(c, x, 200, 60); star(c, x - 90, 140, 10); star(c, x + 100, 270, 9); }
    shape(c, () => rrect(c, x - 70, 380, 140, 520, 20), WHITE, 5);
    const h = 440 * f;
    shape(c, () => rrect(c, x - 36, 880 - h, 72, h, 12), k === 1 ? RED : COL.orange, 4);
    for (let i = 1; i < 5; i++) line(c, [[x - 70, 880 - i * 88], [x - 40, 880 - i * 88]], 4);
  });
  arrow(c, [[190, 52], [540, 42], [890, 52]], RED, 10);
};
const noClock = (c: Ctx) => {
  ground(c);
  window_(c, 90, 90, 560, 560, () => {
    c.fillStyle = DAY; c.fillRect(90, 90, 560, 560);
    sun(c, 210, 220, 50);
    shape(c, () => ell(c, 520, 600, 190, 80), COL.greenLt, 4); shape(c, () => rrect(c, 505, 470, 30, 140, 6), COL.brown, 4); shape(c, () => ell(c, 520, 430, 110, 90), COL.leaf, 5);
    bird(c, 450, 330, 0.5, "#2b2b35", "#14141c", -1, true);
  });
  // a clock turned away: back of the clock
  shadow(c, 150, 676, 70, 12);
  shape(c, () => ell(c, 130, 616, 56, 56), COL.steel, 5);
  shape(c, () => ell(c, 130, 616, 22, 22), COL.steelDk, 4);
  line(c, [[100, 664], [86, 676]], 8); line(c, [[160, 664], [174, 676]], 8);
  // child looking, ear cupped, nose sniffing
  person(c, 840, 1010, 600, { armL: [-0.6, -1.9], armR: [1.2, 1.4] });
  arrow(c, [[740, 560], [660, 500], [650, 420]], RED, 10);
};
const survey = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 940, 440, 36);
  shape(c, () => rrect(c, 90, 100, 900, 840, 18), PAGE, 6);
  for (let i = 1; i < 3; i++) line(c, [[90 + i * 300, 100], [90 + i * 300, 940]], 5);
  for (let i = 1; i < 4; i++) line(c, [[90, 100 + i * 210], [990, 100 + i * 210]], 5);
  const heads = [30, 42, 52, 60];
  heads.forEach((r, i) => {
    const y = 205 + i * 210 + (i === 0 ? 0 : 0);
    shape(c, () => ell(c, 190, y, r, r), i === 3 ? SKIN.adult : SKIN.child, 5);
    shape(c, () => { c.arc(190, y, r * 1.02, Math.PI + 0.45, -0.45); c.closePath(); }, CLOTH.hair, 4);
    shape(c, () => ell(c, 190 - r * 0.35, y + r * 0.1, r * 0.09, r * 0.12), INK, 0); shape(c, () => ell(c, 190 + r * 0.35, y + r * 0.1, r * 0.09, r * 0.12), INK, 0);
    c.beginPath(); c.arc(190, y + r * 0.3, r * 0.28, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
    if (i < 3) sun(c, 490, y, 36 + i * 4); else sun(c, 490, y, 56);
    if (i % 2 === 0) sun(c, 790, y, 36); else { shape(c, () => ell(c, 790, y, 52, 52), NIGHT, 4); moon(c, 790, y, 38); }
  });
};
const windowCalendar = (c: Ctx) => {
  ground(c);
  window_(c, 250, 80, 580, 380, () => {
    c.fillStyle = "#f6b36a"; c.fillRect(250, 80, 580, 380);
    c.fillStyle = DAY; c.fillRect(250, 80, 580, 200);
    shape(c, () => ell(c, 400, 400, 200, 60), COL.greenLt, 4);
    shape(c, () => rrect(c, 640, 250, 24, 200, 6), COL.brown, 4); shape(c, () => ell(c, 652, 220, 80, 70), COL.leaf, 5);
    bird(c, 420, 190, 0.4, COL.red, "#b83f2c", 1, true);
  });
  for (let i = 0; i < 4; i++) {
    const x = 70 + i * 240;
    shape(c, () => rrect(c, x, 580, 210, 380, 12), PAGE, 6);
    write(c, String(i + 1), x + 76, 600, 64, INK, 9);
    lamp(c, x + 50, 940, 0.8, i % 2 === 0);
    shape(c, () => ell(c, x + 150, 760, 18, 18), COL.pink, 4);
    leaf(c, x + 150, 830, 55, -1.2, COL.leaf);
  }
  arrow(c, [[120, 535], [540, 550], [940, 535]], RED, 10);
};
const lightsOut = (c: Ctx) => {
  ground(c, NIGHT);
  stars(c, 31, 12, 30, 30, 1020, 200); moon(c, 120, 110, 50);
  const building = (x: number, lit: boolean) => {
    shape(c, () => rrect(c, x, 330, 360, 620, 10), lit ? "#4a5290" : "#262b52", 6);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 5; j++) {
      const on = lit || (i === 1 && j === 2);
      shape(c, () => rrect(c, x + 28 + i * 80, 360 + j * 120, 56, 80, 6), on ? SUN : "#3a4378", 4);
    }
    if (lit) { c.beginPath(); ell(c, x + 180, 640, 260, 360); c.fillStyle = "rgba(255,211,77,0.15)"; c.fill(); }
  };
  building(60, true); building(660, false);
  // birds pulled to the lit building, others passing the dark one
  bird(c, 90, 250, 0.4, "#e7ddc0", "#b8ad88", 1, true); bird(c, 330, 290, 0.4, "#e7ddc0", "#b8ad88", -1); bird(c, 230, 200, 0.4, "#e7ddc0", "#b8ad88", 1, true);
  bird(c, 700, 200, 0.4, "#e7ddc0", "#b8ad88", 1, true); bird(c, 900, 160, 0.4, "#e7ddc0", "#b8ad88", 1);
  arrow(c, [[620, 90], [760, 90], [940, 90]], RED, 10);
};
const balconyFlowers = (c: Ctx) => {
  ground(c);
  const icons = [
    () => { c.save(); c.beginPath(); c.rect(70, 100, 190, 100); c.clip(); sun(c, 165, 200, 55); c.restore(); },
    () => sun(c, 395, 180, 55),
    () => { c.save(); c.beginPath(); c.rect(600, 100, 190, 100); c.clip(); sun(c, 695, 200, 55); c.restore(); },
    () => { shape(c, () => ell(c, 925, 180, 68, 68), NIGHT, 5); moon(c, 925, 180, 50); },
  ];
  icons.forEach((f, i) => { shape(c, () => rrect(c, 60 + i * 230, 60, 210, 160, 24), i === 3 ? NIGHT_DK : DAY, 5); f(); });
  c.save(); [0, 1, 2, 3].forEach((i) => { c.beginPath(); rrect(c, 60 + i * 230, 60, 210, 160, 24); c.strokeStyle = INK; c.lineWidth = 6; c.stroke(); }); c.restore();
  const fl = [
    (x: number, y: number) => { lotus(c, x, y, 52); },
    (x: number, y: number) => flower(c, x, y, 66, 5, "#d6338a", SUN, ""),
    (x: number, y: number) => flower(c, x, y, 66, 5, WHITE, SUN, ""),
    (x: number, y: number) => flower(c, x, y, 66, 6, WHITE, COL.orange, ""),
  ];
  fl.forEach((f, i) => {
    const x = 165 + i * 230;
    pot(c, x, 880, 150, 120);
    line(c, [[x, 760], [x, 540]], 16, INK); line(c, [[x, 760], [x, 540]], 8, COL.green);
    leaf(c, x, 690, 70, -0.5, COL.leaf); leaf(c, x, 650, 70, Math.PI + 0.5, COL.leaf);
    f(x, 500);
  });
  shape(c, () => rrect(c, 30, 930, 1020, 44, 10), COL.steel, 6);
  arrow(c, [[165, 250], [395, 280], [925, 250]], RED, 8);
};

export const ic_dayNightSeasonsRhythmsOfNatureL3 = cards("sci.day-night-seasons.rhythms-of-nature.L3 cards", [
  rhythm, dailyRhythm, bodyClock, circadian, pulvinus, dayLength, hibernate, chronobiology,
  bigRhythms, darkBoxBean, preDawn, rainTree, (c) => flowerClock(c, false), warbler, dayLengthPlant,
  warmCool, noClock, (c) => flowerClock(c, true), survey, windowCalendar, lightsOut, balconyFlowers,
]);
void D; void WHITE; void RED; void shine; void SKIN; void CLOTH;
