import { COL, INK, BG, SH, WHITE, RED, SKIN, ground, shape, ell, rrect, shadow, shade, line, shine, arrow, bowl, plate, person, hand, write, cards } from "./flatKit";
import type { Ctx } from "./core";

// SET-UP CARDS · sci.energy.heat-moves.L3 · the steel ladle and the two steel spoons with butter dots and peppercorns

const BUTTER = "#ffe27a", BUTTER_DK = "#e8b83a", PEPPER = "#33303a", COUNTER = "#efe4cf";

// a peppercorn: a small black ball with a highlight
const pepper = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), PEPPER, Math.max(3, r * 0.22));
  shape(c, () => ell(c, x - r * 0.3, y - r * 0.32, r * 0.26, r * 0.2), "#9a97a6", 0);
};
// a dot of butter; with a peppercorn pressed in when pep is true
const butter = (c: Ctx, x: number, y: number, r: number, pep = true) => {
  const p = () => ell(c, x, y, r, r * 0.88);
  shape(c, p, BUTTER, 5);
  shade(c, p, BUTTER_DK, -r * 0.3, -r * 0.3, 0.7);
  if (pep) pepper(c, x, y - r * 0.04, r * 0.42);
};
// a steel handle drawn along +x from x0 to x1 (rotate the canvas first), width w, with a hanging hole at the end
const handle = (c: Ctx, x0: number, x1: number, w: number, hole = true) => {
  const p = () => rrect(c, x0, -w / 2, x1 - x0, w, w / 2);
  shape(c, p, COL.steel);
  shade(c, p, COL.steelDk, 0, -w * 0.3, 0.75);
  shine(c, [[x0 + w * 0.7, -w * 0.2], [x1 - w * 0.7, -w * 0.2]], Math.max(3, w * 0.1));
  if (hole) shape(c, () => ell(c, x1 - w * 0.65, 0, w * 0.2, w * 0.2), COL.steelIn, 4);
};
// the head of a spoon or ladle seen from above: a steel oval with a hollow
const headTop = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  const p = () => ell(c, x, y, rx, ry);
  shape(c, p, COL.steel);
  shade(c, p, COL.steelDk, -rx * 0.18, -ry * 0.2, 0.7);
  shape(c, () => ell(c, x - rx * 0.05, y - ry * 0.05, rx * 0.8, ry * 0.76), COL.steelIn, 4);
  shine(c, [[x - rx * 0.55, y - ry * 0.25], [x - rx * 0.2, y - ry * 0.5]], 7);
};
// a steel tumbler: rim centre (cx, rimY), rim half-width rx, bottom at botY; hot water to the brim
const tumbler = (c: Ctx, cx: number, rimY: number, botY: number, rx: number, bx: number) => {
  const ry = rx * 0.24;
  shadow(c, cx + rx * 0.15, botY + 4, rx * 1.15, ry * 0.7);
  const p = () => { c.moveTo(cx - rx, rimY); c.lineTo(cx + rx, rimY); c.lineTo(cx + bx, botY); c.quadraticCurveTo(cx, botY + bx * 0.35, cx - bx, botY); c.closePath(); };
  shape(c, p, COL.steel);
  shade(c, p, COL.steelDk, -rx * 0.55, 0, 0.8);
  shine(c, [[cx - rx * 0.78, rimY + 50], [cx - bx * 0.78, botY - 40]], 9);
  shape(c, () => ell(c, cx, rimY, rx, ry), COL.steelIn, 6);
  shape(c, () => ell(c, cx, rimY + 2, rx * 0.88, ry * 0.8), COL.water, 0);
  shape(c, () => ell(c, cx - rx * 0.25, rimY - 2, rx * 0.3, ry * 0.2), COL.drop, 0);
};
// wavy steam rising from (x, y) up by h
const steam = (c: Ctx, x: number, y: number, h: number) => {
  const pts: number[][] = [];
  for (let i = 0; i <= 20; i++) pts.push([x + Math.sin(i * 0.55) * h * 0.06, y - (i * h) / 20]);
  line(c, pts, h * 0.07 + 6, INK); line(c, pts, h * 0.07, "#f4f7fb");
};
// a phone showing a running timer: dark screen, a clock ring, one red hand
const phone = (c: Ctx, x: number, y: number, w: number, h: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shadow(c, w * 0.1, h / 2 + 8, w * 0.6, w * 0.08);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, w * 0.14), "#3a3550", 6);
  shape(c, () => rrect(c, -w / 2 + w * 0.07, -h / 2 + h * 0.05, w * 0.86, h * 0.9, w * 0.08), "#22303a", 0);
  const R = w * 0.33, cy = -h * 0.04;
  shape(c, () => ell(c, 0, cy, R, R), "#c9f06b", 0);
  shape(c, () => ell(c, 0, cy, R * 0.82, R * 0.82), "#22303a", 0);
  c.beginPath(); c.arc(0, cy, R * 0.9, -Math.PI / 2, Math.PI * 0.75); c.strokeStyle = "#c9f06b"; c.lineWidth = w * 0.06; c.lineCap = "round"; c.stroke();
  line(c, [[0, cy], [0, cy - R * 0.62]], w * 0.05, RED); line(c, [[0, cy], [R * 0.4, cy + R * 0.2]], w * 0.05, WHITE);
  shape(c, () => rrect(c, -w * 0.28, h * 0.3, w * 0.56, h * 0.09, h * 0.04), "#c9f06b", 0);
  c.restore();
};

// ------------------------------------------------------------------ experiment 1: the ladle
// setup.e1.0
const ladleMarks = (c: Ctx) => {
  ground(c);
  plate(c, 540, 540, 470, 300);
  const y = 500, x0 = 370, cm = 62;
  c.save(); c.translate(14, 14); c.globalAlpha = 1; c.restore();
  shadow(c, 640, y + 38, 330, 16);
  c.save(); c.translate(0, y); handle(c, x0 - 40, 930, 44); c.restore();
  headTop(c, 250, y, 125, 82);
  for (const k of [2, 4, 6, 8]) line(c, [[x0 + k * cm, y - 22], [x0 + k * cm, y + 22]], 8, RED);
  // the ruler beside the handle
  shape(c, () => rrect(c, x0 - 40, 590, 580, 90, 8), COL.wood);
  c.fillStyle = COL.woodDk; c.fillRect(x0 - 37, 660, 574, 17);
  for (let k = 0; k <= 8; k++) line(c, [[x0 + k * cm, 590], [x0 + k * cm, 590 + (k % 2 ? 22 : 36)]], k % 2 ? 3 : 5);
  for (const k of [2, 4, 6, 8]) write(c, String(k), x0 + k * cm - 11, 630, 30, INK, 5);
};

// setup.e1.1
const ladleDots = (c: Ctx) => {
  ground(c);
  const y = 560, xs = [480, 620, 760, 900];
  shadow(c, 640, y + 70, 460, 22);
  c.save(); c.translate(0, y); handle(c, 300, 1030, 96); c.restore();
  headTop(c, 190, y, 150, 100);
  xs.slice(0, 3).forEach((x) => butter(c, x, y - 4, 40));
  butter(c, xs[3], y - 4, 40, false);
  // a hand drops the last peppercorn onto the last dot
  hand(c, 930, 233, 1.75, 2);
  pepper(c, 900, 400, 20);
  arrow(c, [[740, 230], [790, 360]]);
};

// the ladle leaning in a steel tumbler of steaming water, handle up and to the right, a phone timer beside it
const ladleInTumbler = (c: Ctx, fallen: boolean) => {
  ground(c);
  const cx = 400, rimY = 520, rx = 175;
  tumbler(c, cx, rimY, 910, rx, 140);
  steam(c, 270, 450, 230); steam(c, 340, 430, 280);
  // the ladle: only what is above the front of the rim shows
  c.save();
  c.beginPath(); c.rect(0, 0, 1080, rimY); ell(c, cx, rimY, rx, rx * 0.24); c.clip();
  c.translate(340, 720); c.rotate(-1.05);
  handle(c, 0, 660, 42);
  const marks = [300, 380, 460, 540];
  marks.forEach((t, i) => {
    if (fallen && i < 2) { shape(c, () => ell(c, t, -2, 34, 14), BUTTER, 0); c.globalAlpha = 0.5; shape(c, () => ell(c, t, -2, 34, 14), BUTTER_DK, 0); c.globalAlpha = 1; }
    else butter(c, t, -6, 29);
  });
  c.restore();
  if (fallen) {
    // the two peppercorns that fell lie on the water
    for (const [x, y] of [[330, 522], [488, 540]]) {
      c.beginPath(); ell(c, x, y + 4, 38, 12); c.strokeStyle = WHITE; c.lineWidth = 5; c.stroke();
      pepper(c, x, y, 22);
    }
  }
  phone(c, 840, 740, 200, 360, 0.06);
};
// setup.e1.2
const ladleStart = (c: Ctx) => ladleInTumbler(c, false);
// setup.e1.3
const ladleLater = (c: Ctx) => ladleInTumbler(c, true);

// ------------------------------------------------------------------ experiment 2: two spoons
// a spoon from above with its dot 3 cm up the handle and a bracket marking the 3 cm
const spoonTop = (c: Ctx, y: number) => {
  shadow(c, 620, y + 42, 420, 16);
  c.save(); c.translate(0, y); handle(c, 280, 1030, 40); c.restore();
  headTop(c, 190, y, 120, 84);
  butter(c, 490, y - 2, 30);
  line(c, [[310, y + 66], [490, y + 66]], 4); line(c, [[310, y + 54], [310, y + 78]], 4); line(c, [[490, y + 54], [490, y + 78]], 4);
  write(c, "3 cm", 350, y + 86, 36, INK, 5);
};
// setup.e2.0
const spoonsPair = (c: Ctx) => {
  ground(c);
  spoonTop(c, 330);
  spoonTop(c, 700);
};

// a spoon standing in a steel tumbler of hot water; origin = middle of the tumbler's base on the table
const spoonStanding = (c: Ctx, cx: number, gy: number, s: number, big = false) => {
  c.save(); c.translate(cx, gy); c.scale(s, s);
  tumbler(c, 0, -280, 0, 130, 105);
  steam(c, -70, -290, 150); steam(c, 70, -290, 120);
  c.save();
  c.beginPath(); c.rect(-400, -1000, 800, 720); ell(c, 0, -280, 130, 34); c.clip();
  c.translate(12, -20); c.rotate(-Math.PI / 2);
  handle(c, 0, 560, 34);
  butter(c, 330, -2, big ? 34 : 24);
  c.restore(); c.restore();
};
// a spoon lying level: head in a bowl of hot water, handle across the rim and on a stack of books
const spoonLying = (c: Ctx, bx: number, by: number, s: number, big = false) => {
  c.save(); c.translate(bx, by); c.scale(s, s);
  bowl(c, 0, 0, 170, COL.water);
  shape(c, () => ell(c, -40, 2, 120, 26), COL.drop, 0);
  steam(c, -80, -20, 150); steam(c, 40, -20, 120);
  const books: [number, number, string, string][] = [[270, 190, COL.red, "#b83a26"], [282, 168, COL.blue, COL.blueDk], [266, 184, COL.green, COL.greenDk]];
  books.forEach(([x, w, col, dk], i) => {
    const y = 72 - i * 29, p = () => rrect(c, x, y, w, 29, 5);
    shape(c, p, col, 5); shade(c, p, dk, 0, -9, 0.7);
    shape(c, () => rrect(c, x + w - 34, y + 5, 28, 19, 3), COL.paper, 3);
  });
  c.save(); c.translate(0, -2); handle(c, 40, 440, 30);
  c.restore();
  shape(c, () => ell(c, -40, 2, 105, 30), COL.steel);
  shape(c, () => ell(c, -42, 0, 84, 22), COL.steelIn, 4);
  butter(c, 226, big ? -10 : -6, big ? 32 : 22);
  c.restore();
};
// setup.e2.1
const spoonsSetUp = (c: Ctx) => {
  ground(c);
  spoonStanding(c, 215, 900, 1);
  spoonLying(c, 565, 790, 1);
};
// setup.e2.2: a hand holds up the phone timer over the two spoons; each dot is about to slide towards the water
const spoonsWatched = (c: Ctx) => {
  ground(c);
  phone(c, 800, 190, 190, 320, 0.08);
  hand(c, 590, 215, 0.08, 1.7);
  spoonStanding(c, 215, 1000, 1, true);
  spoonLying(c, 620, 900, 0.95, true);
  // the same red arrow on each handle, pointing down the handle towards the hot water
  arrow(c, [[186, 470], [186, 590]]);
  arrow(c, [[930, 825], [820, 825]]);
};

export const su_energyHeatMoves = cards("sci.energy.heat-moves.L3 set-up", [ladleMarks, ladleDots, ladleStart, ladleLater, spoonsPair, spoonsSetUp, spoonsWatched]);
