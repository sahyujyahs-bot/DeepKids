import type { Ctx } from "./core";
import { INK, BG, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, rrect, shadow, line, shine, arrow, hand, person, cards } from "./flatKit";

// sci.air.air-around-us.L1 set-up cards: a plastic bag catches air (e1), feeling air on the skin (e2).
const BAG = "rgba(226,241,252,0.8)", FLOOR = "#e3d6bb";

// the sleeve of the arm behind a hand, running on out of the card
const sleeveTo = (c: Ctx, x: number, y: number, an: number, s: number, len: number, col: string = CLOTH.child) => {
  const bx = x - Math.cos(an) * 60 * s, by = y - Math.sin(an) * 60 * s, ex = bx - Math.cos(an) * len, ey = by - Math.sin(an) * len;
  line(c, [[bx, by], [ex, ey]], 72 * s + 12, INK); line(c, [[bx, by], [ex, ey]], 72 * s, col);
};
// a bag's twisted neck, from (x, y) up to (x, y - len)
const neck = (c: Ctx, x: number, y: number, len: number) => {
  shape(c, () => rrect(c, x - 20, y - len, 40, len + 10, 10), BAG, 5);
  for (let k = 0; k < 3; k++) line(c, [[x - 16, y - len + 14 + k * (len / 3.2)], [x + 16, y - len + 28 + k * (len / 3.2)]], 3.5, INK);
};
// a child's head, face looking right; closed = eyes shut. Centre (x, y), radius r
const face = (c: Ctx, x: number, y: number, r: number, closed = false) => {
  shape(c, () => rrect(c, x - r * 0.15, y + r * 0.7, r * 0.5, r * 0.5, r * 0.1), SKIN.child);
  shape(c, () => ell(c, x - 0.12 * r, y - 0.1 * r, r * 1.06, r * 1.08), CLOTH.hair);
  shape(c, () => ell(c, x - r * 1.0, y + 0.1 * r, 0.3 * r, 0.5 * r), CLOTH.hair, 5);
  shape(c, () => ell(c, x + 0.12 * r, y + 0.1 * r, 0.88 * r, 0.95 * r), SKIN.child);
  shape(c, () => { c.moveTo(x - 0.7 * r, y - 0.2 * r); c.bezierCurveTo(x - 0.6 * r, y - 1.1 * r, x + 0.8 * r, y - 1.1 * r, x + 0.98 * r, y - 0.15 * r); c.quadraticCurveTo(x + 0.3 * r, y - 0.55 * r, x - 0.7 * r, y - 0.2 * r); c.closePath(); }, CLOTH.hair, 5);
  shape(c, () => ell(c, x - 0.3 * r, y + 0.2 * r, 0.12 * r, 0.2 * r), SKIN.child, 4);
  shape(c, () => ell(c, x + r * 0.98, y + 0.22 * r, 0.1 * r, 0.12 * r), SKIN.child, 4);
  for (const ex of [0.35, 0.72]) {
    if (closed) { c.beginPath(); c.arc(x + ex * r, y + 0.02 * r, 0.1 * r, 0.15, Math.PI - 0.15); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); }
    else shape(c, () => ell(c, x + ex * r, y + 0.05 * r, 0.05 * r, 0.075 * r), INK, 0);
  }
  c.beginPath(); c.arc(x + 0.6 * r, y + 0.45 * r, 0.14 * r, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke();
  c.globalAlpha = 0.45; shape(c, () => ell(c, x + 0.45 * r, y + 0.32 * r, 0.13 * r, 0.08 * r), COL.pink, 0); c.globalAlpha = 1;
};
// shoulders under a head, running off the bottom of the card
const shoulders = (c: Ctx, x: number, y: number) => shape(c, () => { c.moveTo(x - 330, 1090); c.quadraticCurveTo(x - 300, y, x, y); c.quadraticCurveTo(x + 300, y, x + 330, 1090); c.closePath(); }, CLOTH.child);
// a wavy line of air from (x1, y) to (x2, y)
const wave = (c: Ctx, x1: number, x2: number, y: number, amp: number) => {
  const pts: number[][] = []; for (let i = 0; i <= 20; i++) pts.push([x1 + ((x2 - x1) * i) / 20, y + Math.sin(i * 0.9) * amp]);
  line(c, pts, 8, COL.blueDk);
};

// e1.0: look at the flat bag; six boxes on a paper
const e1_0 = (c: Ctx) => {
  ground(c);
  sleeveTo(c, 170, 235, 0, 1.4, 300);
  shadow(c, 360, 880, 170, 24);
  shape(c, () => { c.moveTo(200, 230); c.lineTo(520, 230); c.quadraticCurveTo(515, 500, 505, 840); c.quadraticCurveTo(360, 860, 215, 840); c.quadraticCurveTo(205, 500, 200, 230); c.closePath(); }, BAG);
  line(c, [[260, 330], [300, 480]], 3.5, COL.glassEdge); line(c, [[440, 330], [410, 520]], 3.5, COL.glassEdge); line(c, [[300, 680], [350, 760]], 3.5, COL.glassEdge);
  shine(c, [[240, 300], [250, 600]], 9);
  hand(c, 170, 235, 0, 1.4);
  // the paper with six boxes
  shadow(c, 800, 900, 190, 26);
  c.save(); c.translate(780, 560); c.rotate(0.05);
  shape(c, () => rrect(c, -190, -300, 380, 600, 14), COL.paper);
  for (let i = 0; i < 6; i++) shape(c, () => rrect(c, -130 + (i % 2) * 140, -250 + Math.floor(i / 2) * 175, 120, 140, 10), WHITE, 5);
  c.restore();
};

// e1.1: the open bag swept under the bed comes out puffed up
const e1_1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = FLOOR; c.fillRect(0, 700, 1080, 380);
  line(c, [[0, 700], [1080, 700]], 6);
  // the bed on the right: mattress and blanket, frame, legs, and the dark space underneath
  shape(c, () => rrect(c, 600, 250, 480, 140, 24), COL.purple);
  shape(c, () => rrect(c, 600, 250, 480, 56, 24), COL.paper);
  shape(c, () => rrect(c, 590, 390, 500, 50, 8), COL.woodDk);
  shape(c, () => c.rect(615, 440, 460, 260), "#7a6a96", 0);
  line(c, [[615, 440], [615, 700]], 6); line(c, [[600, 440], [600, 700]], 14, COL.woodDk); line(c, [[600, 440], [600, 700]], 6, INK);
  shadow(c, 760, 690, 130, 14);
  // the puffed bag out on the floor, neck twisted shut and held
  shadow(c, 330, 705, 190, 26);
  shape(c, () => { c.moveTo(300, 420); c.bezierCurveTo(100, 400, 110, 690, 300, 700); c.bezierCurveTo(480, 710, 520, 420, 300, 420); c.closePath(); }, BAG);
  shine(c, [[170, 520], [200, 620]], 10);
  neck(c, 300, 430, 100);
  sleeveTo(c, 300, 270, Math.PI / 2, 1.2, 300);
  hand(c, 300, 270, Math.PI / 2, 1.2);
  arrow(c, [[720, 590], [560, 590]]);
};

// e1.2: squeeze the puffed bag between both hands
const e1_2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 880, 230, 30);
  neck(c, 540, 340, 100);
  shape(c, () => { c.moveTo(350, 520); c.bezierCurveTo(330, 380, 440, 320, 540, 330); c.bezierCurveTo(640, 320, 750, 380, 730, 520); c.bezierCurveTo(750, 680, 650, 800, 540, 800); c.bezierCurveTo(430, 800, 330, 680, 350, 520); c.closePath(); }, BAG);
  shine(c, [[400, 430], [385, 520]], 10);
  sleeveTo(c, 190, 590, 0, 1.5, 300); hand(c, 190, 590, 0, 1.5, SKIN.child, CLOTH.child, true);
  sleeveTo(c, 890, 590, Math.PI, 1.5, 300); hand(c, 890, 590, Math.PI, 1.5, SKIN.child, CLOTH.child, true);
  arrow(c, [[80, 400], [240, 400]]); arrow(c, [[1000, 400], [840, 400]]);
};

// e1.3: let the air out of the bag onto the cheek
const e1_3 = (c: Ctx) => {
  ground(c);
  shoulders(c, 310, 800);
  face(c, 310, 520, 220);
  // a few hairs lifting in the air
  line(c, [[390, 330], [440, 310], [480, 320]], 5, CLOTH.hair); line(c, [[330, 310], [380, 285], [425, 290]], 5, CLOTH.hair);
  wave(c, 535, 640, 470, 6); wave(c, 535, 640, 610, 6);
  arrow(c, [[650, 540], [575, 540]]);
  // the bag, neck open toward the cheek, squeezed by a hand
  shadow(c, 850, 760, 150, 22);
  shape(c, () => { c.moveTo(690, 500); c.lineTo(690, 580); c.lineTo(740, 610); c.bezierCurveTo(740, 800, 960, 800, 960, 560); c.bezierCurveTo(960, 330, 740, 340, 740, 510); c.closePath(); }, BAG);
  shape(c, () => rrect(c, 650, 505, 50, 70, 10), BAG, 5);
  shine(c, [[780, 430], [770, 520]], 9);
  sleeveTo(c, 1040, 575, Math.PI, 1.3, 300); hand(c, 1040, 575, Math.PI, 1.3);
};

// the notebook, centre (x, y), tilted
const notebook = (c: Ctx, x: number, y: number, w: number, h: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => rrect(c, -w / 2, -h / 2, w, h, 10), COL.purple);
  shape(c, () => rrect(c, -w / 2 + 14, -h / 2 + 14, w - 28, h - 28, 6), COL.paper, 4);
  for (let k = 1; k < 5; k++) line(c, [[-w / 2 + 34, -h / 2 + 14 + k * (h - 28) / 5], [w / 2 - 34, -h / 2 + 14 + k * (h - 28) / 5]], 3, COL.grey);
  c.restore();
};

// e2.0: child on a mat, eyes shut, arm out; grown-up holds a notebook a hand-span away
const e2_0 = (c: Ctx) => {
  ground(c);
  shape(c, () => rrect(c, 30, 790, 1020, 120, 30), COL.teal);
  const ch = 640, cx = 170, cy = 830, ad = 700, ax = 940, ay = 851;
  person(c, cx, cy, ch, { sit: true, armR: [0, 0] });
  // the child's bare forearm, and eyes shut
  const sx = cx + ch * 0.11, ey = cy - ch * 0.06 - ch * 0.32 + ch * 0.03, ex = sx + ch * 0.17, wx = ex + ch * 0.16, uw = ch * 0.06;
  line(c, [[ex, ey], [wx, ey]], uw + 10, INK); line(c, [[ex, ey], [wx, ey]], uw, SKIN.child);
  shape(c, () => ell(c, wx, ey, uw * 0.62, uw * 0.62), SKIN.child, 5);
  const head = ch * 0.13, hy = cy - ch * 0.06 - ch * 0.32 - head * 1.05;
  for (const s of [-1, 1]) { shape(c, () => ell(c, cx + s * head * 0.35, hy + head * 0.12, head * 0.2, head * 0.2), SKIN.child, 0); c.beginPath(); c.arc(cx + s * head * 0.35, hy + head * 0.05, head * 0.14, 0.2, Math.PI - 0.2); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
  // the grown-up, facing the child, holding the notebook
  c.save(); c.translate(ax, 0); c.scale(-1, 1); c.translate(-ax, 0);
  person(c, ax, ay, ad, { sit: true, adult: true, armR: [0, 0] });
  c.restore();
  const awx = ax - ad * 0.11 - ad * 0.33;
  notebook(c, awx - 8, ay - ad * 0.35, 135, 190, 0.08);
  shape(c, () => ell(c, awx, ay - ad * 0.35, ad * 0.04, ad * 0.04), SKIN.adult, 5);
  arrow(c, [[wx + 30, ey + 150], [awx - 80, ey + 150]], RED, 8); arrow(c, [[awx - 80, ey + 150], [wx + 30, ey + 150]], RED, 8);
};

// e2.1: the notebook waved once beside the cheek, the child's eyes shut
const e2_1 = (c: Ctx) => {
  ground(c);
  shoulders(c, 310, 800);
  face(c, 310, 520, 220, true);
  wave(c, 520, 620, 500, 7); wave(c, 520, 620, 620, 7);
  sleeveTo(c, 800, 790, -Math.PI / 2, 1.4, 400, CLOTH.adult);
  notebook(c, 800, 520, 250, 340, -0.2);
  hand(c, 800, 790, -Math.PI / 2, 1.4, SKIN.adult, CLOTH.adult);
  arrow(c, [[690, 290], [740, 240], [830, 225], [900, 250]]);
};

export const su_airAirAroundUsL1 = cards("sci.air.air-around-us.L1 set-up", [e1_0, e1_1, e1_2, e1_3, e2_0, e2_1]);
