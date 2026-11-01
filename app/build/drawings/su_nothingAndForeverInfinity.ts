import type { Ctx } from "./core";
import { COL, INK, WHITE, RED, SKIN, CLOTH, ground, shape, ell, rrect, polyP, shadow, shade, line, shine, arrow, plate, hand, write, cards } from "./flatKit";

// set-up cards for sci.nothing-and-forever.infinity.L3: reading numbers aloud against a stopwatch,
// and counting rice (grains, heaps of ten, a tumbler filled by teaspoons)

const comma = (c: Ctx, x: number, y: number, h: number) => line(c, [[x, y], [x - h * 0.08, y + h * 0.22]], 5);
// a number with Indian commas, e.g. [1,23,451]
const bigNum = (c: Ctx, parts: string[], x: number, y: number, h: number) => {
  let cx = x;
  parts.forEach((p, i) => { write(c, p, cx, y, h, INK, 5); cx += p.length * h * 0.8; if (i < parts.length - 1) { comma(c, cx - h * 0.05, y + h * 0.92, h); cx += h * 0.3; } });
};
// a sheet of paper with a soft shadow
const paper = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 16, y + h + 10, w * 0.52, 26);
  shape(c, () => rrect(c, x, y, w, h, 10), COL.paper);
  shade(c, () => rrect(c, x, y, w, h, 10), COL.cloth, 18, 0, 0.9);
  shape(c, () => rrect(c, x, y, w, h, 10), "rgba(0,0,0,0)");
};
// a grain of rice
const rice = (c: Ctx, x: number, y: number, rot: number, r = 17) => {
  shape(c, () => ell(c, x, y, r, r * 0.4, rot), WHITE, 3);
  c.save(); c.beginPath(); ell(c, x, y, r, r * 0.4, rot); c.clip(); c.beginPath(); ell(c, x + r * 0.3, y + r * 0.35, r, r * 0.4, rot); c.fillStyle = COL.grey; c.globalAlpha = 0.45; c.fill(); c.restore(); c.globalAlpha = 1;
};
// a steel teaspoon: handle starts at (x, y) and runs at angle an; the bowl is at the far end
const spoon = (c: Ctx, x: number, y: number, an: number, len: number, rr: number, loaded: boolean) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, 0, -11, len, 22, 11), COL.steel);
  shape(c, () => ell(c, len + rr * 0.9, 0, rr, rr * 0.68), COL.steel);
  shape(c, () => ell(c, len + rr * 0.9, 0, rr * 0.8, rr * 0.5), COL.steelIn, 4);
  if (loaded) shape(c, () => ell(c, len + rr * 0.9, 0, rr * 0.8, rr * 0.5), WHITE, 3);
  c.restore();
};
// a pencil with its tip at (x, y), pointing along angle an, body length len behind the cone
const pencil = (c: Ctx, x: number, y: number, an: number, len = 330) => {
  c.save(); c.translate(x, y); c.rotate(an + Math.PI);
  shape(c, () => rrect(c, 70, -15, len, 30, 6), COL.yellow);
  shape(c, () => polyP(c, [[70, -15], [0, 0], [70, 15]]), COL.wood, 5);
  shape(c, () => polyP(c, [[18, -4], [0, 0], [18, 4]]), INK, 2);
  shape(c, () => rrect(c, 70 + len, -15, 30, 30, 6), COL.pink);
  c.restore();
};
// a hand writing: pencil tip at (x, y), the hand gripping the pencil from the right
const writer = (c: Ctx, x: number, y: number, s = 1.6, tilt = 0.4) => {
  const an = Math.PI - tilt, dx = Math.cos(an), dy = Math.sin(an), d = 70 + 110, hx = x - dx * d, hy = y - dy * d;
  pencil(c, x, y, an);
  hand(c, hx - dx * 70 * s, hy - dy * 70 * s, an, s, SKIN.adult, CLOTH.adult);
};
// a child's face looking at us, mouth open (reading aloud), with sound curves
const reader = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + 20, y + r * 1.05, r * 0.9, 24);
  shape(c, () => rrect(c, x - r * 0.9, y + r * 0.85, r * 1.8, r * 0.8, 30), CLOTH.child);
  shape(c, () => ell(c, x, y, r, r * 1.05), SKIN.child);
  shape(c, () => { c.moveTo(x - r * 1.04, y); c.bezierCurveTo(x - r, y - r * 1.55, x + r, y - r * 1.55, x + r * 1.04, y); c.quadraticCurveTo(x, y - r * 0.6, x - r * 1.04, y); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, x - r * 0.38, y + r * 0.05, r * 0.1, r * 0.14), INK, 0); shape(c, () => ell(c, x + r * 0.38, y + r * 0.05, r * 0.1, r * 0.14), INK, 0);
  shape(c, () => ell(c, x, y + r * 0.5, r * 0.2, r * 0.25), INK, 4);
  for (const k of [1, 2]) { c.beginPath(); c.arc(x + r * 1.25, y + r * 0.5, r * 0.28 * k, -0.7, 0.7); c.strokeStyle = COL.blueDk; c.lineWidth = 7; c.lineCap = "round"; c.stroke(); }
};
// a phone showing a stopwatch
const phone = (c: Ctx, x: number, y: number, w: number, h: number, tick: string) => {
  shadow(c, x + w / 2 + 14, y + h + 8, w * 0.56, 24);
  shape(c, () => rrect(c, x, y, w, h, 34), COL.black, 7);
  shape(c, () => rrect(c, x + 16, y + 20, w - 32, h - 40, 18), "#dff1ff", 4);
  const cx = x + w / 2, cy = y + h * 0.42, r = w * 0.34;
  shape(c, () => rrect(c, cx - 14, cy - r - 30, 28, 22, 5), COL.orange, 4);
  shape(c, () => ell(c, cx, cy, r, r), WHITE, 6);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line(c, [[cx + Math.sin(a) * r * 0.78, cy - Math.cos(a) * r * 0.78], [cx + Math.sin(a) * r * 0.92, cy - Math.cos(a) * r * 0.92]], 5); }
  line(c, [[cx, cy], [cx + r * 0.5, cy - r * 0.45]], 8, RED); shape(c, () => ell(c, cx, cy, 9, 9), INK, 0);
  write(c, tick, cx - tick.length * 24, y + h * 0.78, 60, INK, 8);
};

// setup.e1.0
const card0 = (c: Ctx) => {
  ground(c);
  paper(c, 90, 110, 900, 860);
  const cols: [number, () => void][] = [
    [140, () => {}], [430, () => {}], [690, () => {}],
  ];
  const lists: string[][][] = [
    [["1"], ["2"], ["3"], ["4"], ["5"], ["6"]],
    [["351"], ["352"], ["353"], ["354"], ["355"], ["356"]],
    [["1", "23", "451"], ["1", "23", "452"], ["1", "23", "453"], ["1", "23", "454"], ["1", "23", "455"], ["1", "23", "456"]],
  ];
  cols.forEach(([x], k) => {
    lists[k].forEach((n, i) => { const y = 160 + i * 88; if (k === 2) bigNum(c, n, x - 35, y, 54); else bigNum(c, n, x + (k === 0 ? 40 : 0), y, 54); });
    for (let d = 0; d < 3; d++) shape(c, () => ell(c, x + 90, 715 + d * 40, 7, 7), INK, 0);
    if (k) line(c, [[x - 40, 150], [x - 40, 740]], 5, COL.grey);
  });
  writer(c, 330, 860);
};

// setup.e1.1
const card1 = (c: Ctx) => {
  ground(c);
  reader(c, 330, 250, 120);
  paper(c, 60, 430, 560, 560);
  [["1"], ["2"], ["3"], ["4"], ["5"]].forEach((n, i) => write(c, n[0], 190, 470 + i * 96, 62, INK, 6));
  [["351"], ["352"], ["353"], ["354"]].forEach((n, i) => write(c, n[0], 330, 470 + i * 96, 62, INK, 6));
  hand(c, -40, 880, -0.2, 1.7, SKIN.child, CLOTH.child);
  phone(c, 660, 400, 290, 500, "12");
  hand(c, 805, 1010, -Math.PI / 2, 1.9, SKIN.adult, CLOTH.adult);
};

// setup.e1.2
const card2 = (c: Ctx) => {
  ground(c);
  paper(c, 70, 90, 940, 800);
  // header: a stopwatch over the two tries
  const sw = (x: number, y: number) => { shape(c, () => ell(c, x, y, 34, 34), WHITE, 5); line(c, [[x, y], [x + 14, y - 14]], 6, RED); shape(c, () => rrect(c, x - 8, y - 48, 16, 12, 3), COL.orange, 3); };
  sw(540, 165); sw(860, 165);
  const rows: [string[], number, number][] = [[["20"], 6, 7], [["351"], 9, 10], [["1", "23", "451"], 14, 15]];
  line(c, [[120, 230], [960, 230]], 6, COL.grey);
  rows.forEach(([n, a, b], i) => {
    const y = 250 + i * 165;
    if (n.length > 1) bigNum(c, n, 110, y + 40, 52); else write(c, n[0], 130, y + 40, 52, INK, 6);
    [[a, 400], [b, 400]].forEach(([t], j) => {
      const x = 420 + j * 320;
      shape(c, () => rrect(c, x, y + 20, 15 * t + 50, 70, 12), i === 0 ? COL.greenLt : i === 1 ? COL.yellow : COL.orange);
      write(c, String(t), x + 14, y + 36, 40, INK, 6);
    });
    line(c, [[120, y + 140], [960, y + 140]], 4, COL.grey);
  });
  writer(c, 440, 800, 1.6, 0.12);
};

// setup.e2.0
const card3 = (c: Ctx) => {
  ground(c);
  plate(c, 590, 830, 360, 120);
  [[0, 0], [38, 8], [-38, 6], [16, -16], [-18, -14], [60, -4], [-62, 0], [0, 14]].forEach(([dx, dy], i) => rice(c, 600 + dx * 1.2, 830 + dy * 1.2, 0.3 * i, 24));
  [[565, 540, 1.2], [585, 590, 0.2], [570, 640, 2.2], [592, 690, 0.9], [580, 740, 1.7]].forEach(([x, y, r]) => rice(c, x, y, r, 24));
  spoon(c, 150, 190, 0.62, 330, 80, false);
  [[0, 0], [30, 14], [-30, -10], [-10, 18], [24, -18], [-44, 10], [46, 8], [8, -2]].forEach(([dx, dy], i) => rice(c, 480 + dx * 0.9, 425 + dy * 0.7, 0.6 + i * 0.7, 20));
  hand(c, 150, 190, 0.62, 1.8, SKIN.child, CLOTH.child);
  arrow(c, [[790, 520], [790, 680]]);
};

// setup.e2.1
const card4 = (c: Ctx) => {
  ground(c);
  plate(c, 540, 580, 480, 300);
  const heap = (x: number, y: number) => {
    [[4, -75], [3, -37], [2, 0], [1, 37]].forEach(([n, dy]) => { for (let k = 0; k < n; k++) rice(c, x + (k - (n - 1) / 2) * 58, y + dy * 0.75 + 30, 0.15 * k, 28); });
    write(c, "10", x - 30, y + 78, 46, INK, 6);
  };
  heap(260, 450); heap(520, 400); heap(790, 470); heap(380, 650);
  rice(c, 600, 620, 0.2, 28);
  hand(c, 840, 680, Math.PI + 0.12, 1.6, SKIN.adult, CLOTH.adult, true);
  arrow(c, [[560, 700], [500, 730]]);
};

// setup.e2.2
const card5 = (c: Ctx) => {
  ground(c);
  // the steel tumbler with a window: rice filled up to about two thirds
  const x = 300, top = 470, bot = 940, tw = 150, bw = 125;
  shadow(c, x + 40, bot + 16, tw * 1.1, 28);
  const body = () => { c.moveTo(x - tw, top); c.lineTo(x + tw, top); c.lineTo(x + bw, bot); c.lineTo(x - bw, bot); c.closePath(); };
  shape(c, body, COL.steel);
  shade(c, body, COL.steelDk, 70, 0, 0.55);
  shape(c, () => ell(c, x, top, tw, 34), COL.steelIn, 6);
  const win = () => rrect(c, x - 85, 570, 170, 320, 22);
  shape(c, win, "#e9f3ff", 6);
  c.save(); c.beginPath(); win(); c.clip();
  for (let r = 0; r < 9; r++) for (let k = 0; k < 6; k++) rice(c, x - 70 + k * 27 + (r % 2) * 13, 665 + r * 25, (r * 7 + k * 3) * 0.5, 15);
  c.restore();
  shape(c, win, "rgba(0,0,0,0)", 6);
  // the spoon above, tipping a spoonful in
  spoon(c, 90, 110, 0.5, 250, 62, true);
  rice(c, 335, 330, 1.1, 18); rice(c, 322, 375, 0.4, 18); rice(c, 330, 420, 2.0, 18);
  hand(c, 90, 110, 0.5, 1.7, SKIN.child, CLOTH.child);
  arrow(c, [[470, 300], [470, 410]]);
  // the paper: a spoon picture, then one tally mark for every spoonful
  paper(c, 630, 150, 390, 600);
  spoon(c, 690, 215, -0.35, 100, 30, true);
  line(c, [[670, 270], [980, 270]], 5, COL.grey);
  const tally = (px: number, py: number, n: number) => {
    for (let k = 0; k < Math.min(4, n); k++) line(c, [[px + k * 24, py], [px + k * 24, py + 70]], 8);
    if (n >= 5) line(c, [[px - 12, py + 56], [px + 88, py + 14]], 8, RED);
  };
  tally(680, 300, 5); tally(680, 410, 5); tally(680, 520, 2); tally(830, 300, 5); tally(830, 410, 1);
  writer(c, 760, 590, 1.3, 0.3);
};

export const su_nothingAndForeverInfinity = cards("sci.nothing-and-forever.infinity.L3 set-up", [card0, card1, card2, card3, card4, card5]);
