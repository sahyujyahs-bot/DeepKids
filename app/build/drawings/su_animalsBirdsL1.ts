import type { Ctx } from "./core";
import { COL, INK, WHITE, RED, SKIN, CLOTH, ground, shape, ell, rrect, polyP, shadow, line, arrow, bowl, seed, hand, write, cards } from "./flatKit";

// sci.animals.birds.L1 set-up cards: counting bird calls with beans

const RAJMA = "#a8402f", RAJMA_DK = "#7a2a20";
const bean = (c: Ctx, x: number, y: number, r: number, rot: number) => seed(c, x, y, r, rot, false, RAJMA, RAJMA_DK);

// a sun on a little paper tag: kind 0 morning (low, half), 1 afternoon (high, full), 2 evening (low, red, half)
const sunTag = (c: Ctx, x: number, y: number, kind: number) => {
  shape(c, () => rrect(c, x - 85, y - 70, 170, 140, 22), kind === 2 ? "#f6c7a4" : kind === 1 ? COL.sky : "#fff1c9", 5);
  const sy = kind === 1 ? y - 10 : y + 25, col = kind === 2 ? COL.red : COL.yellow;
  c.save(); c.beginPath(); c.rect(x - 85, y - 70, 170, 140); c.clip();
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; line(c, [[x + Math.cos(a) * 42, sy + Math.sin(a) * 42], [x + Math.cos(a) * 58, sy + Math.sin(a) * 58]], 7, col === COL.red ? COL.orange : COL.orange); }
  shape(c, () => ell(c, x, sy, 32, 32), col, 5);
  if (kind !== 1) { c.fillStyle = "#6aa53f"; c.fillRect(x - 85, y + 25, 170, 45); c.beginPath(); c.moveTo(x - 85, y + 25); c.lineTo(x + 85, y + 25); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); }
  c.restore();
  shape(c, () => rrect(c, x - 85, y - 70, 170, 140, 22), "rgba(0,0,0,0)", 5);
};

// card 1: three cups with sun tags, a heap of beans in front
const card0 = (c: Ctx) => {
  ground(c);
  [0, 1, 2].forEach((i) => { const x = 200 + i * 340; sunTag(c, x, 190, i); bowl(c, x, 430, 135); });
  shadow(c, 560, 900, 330, 55);
  const heap = () => { c.moveTo(250, 880); c.bezierCurveTo(300, 640, 820, 640, 870, 880); c.closePath(); };
  shape(c, heap, RAJMA_DK, 6);
  const pts: number[][] = [];
  for (let row = 0; row < 7; row++) { const y = 730 + row * 22, half = 40 + row * 42; for (let k = 0; k < 2 + row * 2; k++) pts.push([560 - half + (k + 0.5) * (2 * half) / (2 + row * 2) + (row % 2) * 6, y + (k % 2) * 8]); }
  c.save(); c.beginPath(); heap(); c.clip(); pts.forEach(([x, y], i) => bean(c, x, y, 26, (i * 0.9) % 3)); c.restore();
  shape(c, heap, "rgba(0,0,0,0)", 6);
};

// a small bird at (x, y), facing left, size s
const bird = (c: Ctx, x: number, y: number, s: number) => {
  c.save(); c.translate(x, y); c.scale(s, s);
  shape(c, () => polyP(c, [[50, 0], [130, -20], [125, 25]]), COL.blueDk, 5);
  shape(c, () => ell(c, 0, 0, 70, 50, -0.15), COL.blue, 6);
  shape(c, () => ell(c, 10, 12, 40, 26, -0.15), "#f6e3b4", 0);
  shape(c, () => ell(c, 15, -5, 38, 22, 0.5), COL.blueDk, 5);
  shape(c, () => ell(c, -55, -35, 32, 30), COL.blue, 6);
  shape(c, () => polyP(c, [[-82, -40], [-110, -30], [-82, -26]]), COL.orange, 5);
  shape(c, () => ell(c, -60, -42, 6, 7), INK, 0);
  c.restore();
};

// card 2: a child's hand drops a bean into a cup under a window with a bird; a grown-up's hand holds a phone timer
const card1 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 50, 40, 980, 400, 20), COL.sky, 8);
  shape(c, () => ell(c, 260, 130, 90, 40), WHITE, 0);
  line(c, [[540, 40], [540, 440]], 12); line(c, [[50, 240], [1030, 240]], 12);
  bird(c, 810, 140, 1.1);
  shape(c, () => rrect(c, 20, 430, 1040, 40, 8), COL.wood, 6);
  // the cup with beans, the child's hand above it
  bowl(c, 300, 760, 150);
  for (let i = 0; i < 6; i++) bean(c, 215 + i * 34, 756 + (i % 2) * 8, 22, i * 1.3);
  hand(c, 130, 560, 0.5, 1.5, SKIN.child, CLOTH.child, true);
  bean(c, 318, 630, 24, 0.6);
  arrow(c, [[318, 660], [318, 715]]);
  // the grown-up's hand with the phone timer
  shape(c, () => rrect(c, 600, 520, 190, 340, 28), COL.black, 6);
  shape(c, () => rrect(c, 615, 545, 160, 290, 14), "#22303a", 4);
  c.beginPath(); c.arc(695, 725, 58, 0, Math.PI * 2); c.strokeStyle = COL.teal; c.lineWidth = 14; c.stroke();
  line(c, [[695, 725], [695, 688]], 9, "#c9f06b"); line(c, [[695, 725], [728, 740]], 9, "#c9f06b");
  write(c, "5", 672, 570, 50, "#c9f06b", 8);
  hand(c, 930, 760, Math.PI, 1.5, SKIN.adult, CLOTH.adult, false);
};

// card 3: three lines of beans, long / short / in between, under the three cups
const card2 = (c: Ctx) => {
  ground(c);
  [9, 4, 6].forEach((n, i) => {
    const x = 200 + i * 340;
    sunTag(c, x, 105, i);
    bowl(c, x, 270, 100);
    for (let k = 0; k < n; k++) bean(c, x, 380 + k * 62, 28, Math.PI / 2);
  });
};

export const su_animalsBirdsL1 = cards("sci.animals.birds.L1 set-up", [card0, card1, card2]);
