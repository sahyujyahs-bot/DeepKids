import { arrow, cards, COL, ell, ground, INK, line, person, polyP, rnd, rrect, shade, shadow, shape, SKIN, WHITE, write, hand, CLOTH } from "./flatKit";
import type { Ctx } from "./core";

const arc = (c: Ctx, cx: number, cy: number, r: number, a0: number, a1: number) => arrow(c, Array.from({ length: 13 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / 12; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; }), RED_);
// a dough animal (atta dough) with n legs, feet on y = gy, centred on cx
const dough = (c: Ctx, cx: number, gy: number, n: number) => {
  const body = () => ell(c, cx, gy - 200, 150, 80);
  const xs = n === 2 ? [cx - 25, cx + 25] : n === 3 ? [cx - 100, cx, cx + 100] : [cx - 110, cx - 40, cx + 40, cx + 110];
  xs.forEach((x) => shape(c, () => rrect(c, x - 20, gy - 200, 40, 200, 16), COL.woodDk));
  shape(c, body, COL.wood);
  shade(c, body, COL.woodDk, 30, 24, 0.5);
  shape(c, () => ell(c, cx + 160, gy - 250, 55, 50), COL.wood);
  shape(c, () => ell(c, cx + 178, gy - 258, 9, 11), INK, 0);
  line(c, [[cx - 145, gy - 215], [cx - 205, gy - 270]], 18, INK); line(c, [[cx - 145, gy - 215], [cx - 205, gy - 270]], 8, COL.wood);
};

const e1 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e0d2b4"; c.fillRect(0, 800, 1080, 280); line(c, [[0, 800], [1080, 800]], 6);
  const place = (cx: number, n: number, tilt = 0) => {
    c.save(); c.translate(cx + (tilt ? 25 * 0.85 : 0), 800); c.scale(0.85, 0.85); c.rotate(tilt); dough(c, tilt ? -25 : 0, 0, n); c.restore();
  };
  shadow(c, 190, 820, 130, 18); shadow(c, 540, 820, 130, 18); shadow(c, 890, 820, 130, 18);
  place(160, 2, 0.45); place(540, 3); place(890, 4);
  arc(c, 200, 520, 150, Math.PI * 1.1, Math.PI * 1.85);
  write(c, "2", 160, 890, 110); write(c, "3", 510, 890, 110); write(c, "4", 860, 890, 110);
};
const RED_ = "#d7372b";

const e2 = (c: Ctx) => {
  ground(c);
  const one = (cx: number, fin: boolean) => {
    shadow(c, cx + 20, 930, 240, 28);
    shape(c, () => polyP(c, [[cx - 230, 420], [cx + 230, 420], [cx + 180, 900], [cx - 180, 900]]), COL.teal);
    shape(c, () => polyP(c, [[cx - 218, 500], [cx + 218, 500], [cx + 172, 888], [cx - 172, 888]]), COL.water, 0);
    if (fin) shape(c, () => rrect(c, cx - 22, 520, 44, 250, 8), COL.yellow);
    shape(c, () => ell(c, cx, 500, 110, 110), COL.glass, 6);
    shape(c, () => ell(c, cx, 500, 42, 42), COL.steelIn, 5);
    c.save(); c.beginPath(); c.rect(cx - 230, 500, 460, 400); c.clip(); c.fillStyle = "rgba(143,195,234,0.45)"; c.fillRect(cx - 230, 500, 460, 400); c.restore();
    line(c, [[cx - 218, 500], [cx + 218, 500]], 5, COL.waterDk);
    shape(c, () => polyP(c, [[cx - 230, 420], [cx - 218, 500], [cx - 172, 888], [cx - 180, 900], [cx - 190, 900], [cx - 230, 420]]), COL.tealDk, 0);
  };
  one(290, false); one(790, true);
  arc(c, 290, 500, 170, Math.PI * 1.15, Math.PI * 1.85);
};

const a2 = (c: Ctx) => {
  ground(c);
  // a child's forearm and hand, palm down, with fine arm hairs and a magnifier above
  shape(c, () => polyP(c, [[60, 640], [560, 600], [560, 800], [60, 820]]), CLOTH.child);
  shape(c, () => rrect(c, 540, 590, 380, 220, 70), SKIN.child);
  shade(c, () => rrect(c, 540, 590, 380, 220, 70), SKIN.childDk, 0, 40, 0.5);
  const r = rnd(5);
  for (let i = 0; i < 26; i++) { const x = 600 + r() * 220, y = 610 + r() * 40; line(c, [[x, y], [x + 18, y - 22]], 4, "#2b2340"); }
  for (let k = 0; k < 4; k++) shape(c, () => rrect(c, 800 + k * 28, 600 + k * 14, 70, 44, 22), "#f4d9c4", 4);
  // magnifier
  line(c, [[700, 400], [610, 580]], 30, INK); line(c, [[700, 400], [610, 580]], 16, COL.brown);
  shape(c, () => ell(c, 740, 270, 170, 170), "rgba(214,236,250,0.65)", 14);
  for (let i = 0; i < 9; i++) { const x = 650 + i * 22; line(c, [[x, 360], [x + 24, 300]], 7, INK); }
  line(c, [[640, 250], [690, 180]], 14, WHITE);
};

const a3 = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#cfe8f6"; c.fillRect(0, 0, 1080, 800); c.fillStyle = "#e0d2b4"; c.fillRect(0, 800, 1080, 280); line(c, [[0, 800], [1080, 800]], 6);
  shadow(c, 540, 930, 230, 28);
  person(c, 540, 930, 760, { armL: [Math.PI * 1.1, Math.PI * 1.25], armR: [-Math.PI * 0.1, -Math.PI * 0.25] });
  arrow(c, [[200, 330], [150, 230]], RED_); arrow(c, [[880, 330], [930, 230]], RED_);
};

const a5 = (c: Ctx) => {
  ground(c);
  const vane = () => { c.moveTo(250, 860); c.bezierCurveTo(180, 520, 520, 220, 840, 170); c.bezierCurveTo(900, 450, 560, 800, 250, 860); c.closePath(); };
  shadow(c, 560, 930, 360, 30);
  shape(c, vane, COL.steel); shade(c, vane, COL.steelDk, 50, 60, 0.5);
  for (let i = 0; i < 12; i++) { const t = 0.12 + i * 0.07, x = 250 + 590 * t, y = 860 - 690 * t; line(c, [[x, y], [x + 70, y + 30]], 3, COL.steelDk); line(c, [[x, y], [x - 30, y - 60]], 3, COL.steelDk); }
  line(c, [[230, 880], [850, 160]], 12, INK); line(c, [[230, 880], [850, 160]], 5, WHITE);
  const drop = (x: number, y: number, r: number) => { shape(c, () => ell(c, x, y, r, r * 0.8), COL.drop, 5); shine(c, [[x - r * 0.5, y - r * 0.3], [x - r * 0.1, y - r * 0.5]], 5); };
  drop(520, 470, 40); drop(640, 380, 32); drop(430, 640, 36); drop(700, 520, 30);
  arrow(c, [[560, 300], [640, 250]], COL.blueDk, 8);
};
const shine = (c: Ctx, pts: number[][], w: number) => line(c, pts, w, WHITE);

const p1 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 900, 450, 36);
  shape(c, () => polyP(c, [[90, 280], [540, 330], [540, 880], [90, 820]]), "#fffaf0");
  shape(c, () => polyP(c, [[540, 330], [990, 280], [990, 820], [540, 880]]), "#f6efe0");
  line(c, [[540, 330], [540, 880]], 8);
  // left page: a bird
  shape(c, () => ell(c, 300, 600, 110, 70, -0.2), COL.blue); shape(c, () => ell(c, 410, 530, 40, 36), COL.blue);
  shape(c, () => polyP(c, [[445, 525], [490, 540], [445, 550]]), COL.orange, 4); shape(c, () => ell(c, 418, 522, 6, 6), INK, 0);
  shape(c, () => polyP(c, [[200, 610], [140, 700], [230, 650]]), COL.blueDk); line(c, [[300, 660], [300, 730]], 6); line(c, [[330, 660], [330, 730]], 6);
  // right page: a fish
  shape(c, () => ell(c, 770, 590, 120, 70), COL.orange); shape(c, () => polyP(c, [[880, 590], [960, 530], [960, 650]]), COL.orange);
  shape(c, () => polyP(c, [[740, 525], [800, 470], [810, 530]]), COL.red, 4); shape(c, () => ell(c, 700, 575, 9, 9), INK, 0);
  // pencil
  c.save(); c.translate(1010, 950); c.rotate(0.5); shape(c, () => rrect(c, -20, -330, 40, 300, 6), COL.yellow); shape(c, () => polyP(c, [[-20, -30], [20, -30], [0, 30]]), "#f4d9c4", 5); c.restore();
};

const balance = (c: Ctx) => {
  ground(c);
  shadow(c, 540, 930, 200, 24);
  const h = 780, x = 540, y = 930, hip = y - h * 0.42;
  c.save(); c.beginPath(); c.rect(0, 0, 1080, 1080); c.rect(x, hip + h * 0.05, 600, 600); c.clip("evenodd");
  person(c, x, y, h, { armL: [Math.PI * 1.03, Math.PI * 1.03], armR: [-Math.PI * 0.03, -Math.PI * 0.03] });
  c.restore();
  const k: number[][] = [[x + h * 0.05, hip], [x + h * 0.22, hip + h * 0.12], [x + h * 0.1, hip + h * 0.25]];
  line(c, k, h * 0.075, INK); line(c, k, h * 0.075 - 10, "#6b5a8c");
  for (const r of [60, 95]) { c.beginPath(); c.arc(x - h * 0.06, y - 10, r, Math.PI * 0.9, Math.PI * 1.4); c.strokeStyle = RED_; c.lineWidth = 8; c.lineCap = "round"; c.stroke(); c.beginPath(); c.arc(x - h * 0.06, y - 10, r, Math.PI * 1.6, Math.PI * 2.1); c.stroke(); }
};

const panel = (c: Ctx, x: number, y: number, col: string, fn: () => void, h = 450) => {
  c.save(); c.beginPath(); rrect(c, x, y, 450, h, 30); c.clip(); c.fillStyle = col; c.fillRect(x, y, 450, h); fn(); c.restore();
  c.beginPath(); rrect(c, x, y, 450, h, 30); c.strokeStyle = INK; c.lineWidth = 8; c.stroke();
};
const coverings = (c: Ctx) => {
  ground(c);
  panel(c, 60, 60, "#c28a54", () => { const r = rnd(3); for (let i = 0; i < 260; i++) { const x = 60 + r() * 450, y = 60 + r() * 450; line(c, [[x, y], [x + 14 + r() * 8, y - 28]], 6, r() > 0.5 ? "#7a4c28" : "#e0b07c"); } });
  panel(c, 570, 60, "#bfe0f5", () => { for (let row = 0; row < 7; row++) for (let i = 0; i < 6; i++) shape(c, () => ell(c, 570 + i * 90 + (row % 2) * 45, 80 + row * 70, 50, 62), row % 2 ? COL.teal : COL.blue, 5); });
  panel(c, 60, 570, "#cfd8e0", () => { for (let row = 0; row < 9; row++) for (let i = 0; i < 7; i++) shape(c, () => { const cx = 60 + i * 76 + (row % 2) * 38, cy = 600 + row * 48; c.arc(cx, cy, 40, 0, Math.PI); c.closePath(); }, row % 2 ? COL.steel : "#e8b04a", 4); });
  panel(c, 570, 570, "#e5dcc6", () => {
    shape(c, () => ell(c, 795, 800, 170, 170), COL.brown); shade(c, () => ell(c, 795, 800, 170, 170), "#6a4128", 40, 40, 0.4);
    c.beginPath(); for (let a = 0; a < 15; a += 0.15) { const r = 8 + a * 10; c.lineTo(795 + Math.cos(a) * r, 800 + Math.sin(a) * r); } c.strokeStyle = INK; c.lineWidth = 7; c.stroke();
  });
};

const wingsFins = (c: Ctx) => {
  ground(c);
  panel(c, 30, 180, "#cfe8f6", () => {
    c.translate(300, 600); c.scale(0.8, 0.8); c.translate(-340, -600);
    const body = () => ell(c, 280, 640, 150, 80, 0.15);
    shape(c, () => polyP(c, [[150, 660], [50, 720], [160, 720]]), "#2f2f3e");
    shape(c, body, "#4a4a5a");
    shape(c, () => ell(c, 440, 570, 55, 50), "#4a4a5a");
    shape(c, () => polyP(c, [[488, 565], [545, 585], [488, 600]]), COL.orange, 4); shape(c, () => ell(c, 460, 558, 8, 8), WHITE, 3);
    shape(c, () => { c.moveTo(220, 610); c.quadraticCurveTo(190, 380, 340, 280); c.quadraticCurveTo(350, 460, 350, 620); c.closePath(); }, "#6a6a7e");
    arrow(c, [[110, 500], [100, 320]], RED_, 10);
  }, 720);
  panel(c, 550, 180, COL.water, () => {
    c.translate(775, 640); c.scale(0.85, 0.85); c.translate(-820, -640);
    shape(c, () => polyP(c, [[900, 640], [1020, 540], [1020, 740]]), COL.orange);
    shape(c, () => polyP(c, [[740, 560], [810, 480], [870, 560]]), COL.red, 5);
    shape(c, () => ell(c, 790, 640, 170, 100), COL.orange);
    shape(c, () => polyP(c, [[770, 680], [830, 780], [800, 690]]), COL.red, 5);
    shape(c, () => ell(c, 665, 620, 12, 12), INK, 0);
    arrow(c, [[860, 850], [660, 850]], RED_, 10);
  }, 720);
};

const stool = (c: Ctx, cx: number, gy: number, legs: number) => {
  if (legs === 3) shape(c, () => rrect(c, cx - 18, gy - 250, 36, 250, 8), COL.woodDk);
  const sx = legs === 3 ? [-150, 150] : [-110, 110];
  sx.forEach((s) => shape(c, () => polyP(c, [[cx + s * 0.55 - 18, gy - 250], [cx + s * 0.55 + 18, gy - 250], [cx + s + 16, gy], [cx + s - 16, gy]]), COL.wood));
  shape(c, () => rrect(c, cx - 190, gy - 300, 380, 60, 18), COL.wood); shade(c, () => rrect(c, cx - 190, gy - 300, 380, 60, 18), COL.woodDk, 30, 30, 0.5);
};
const standing = (c: Ctx) => {
  ground(c);
  c.fillStyle = "#e0d2b4"; c.fillRect(0, 830, 1080, 250); line(c, [[0, 830], [1080, 830]], 6);
  shadow(c, 280, 850, 190, 20);
  stool(c, 280, 830, 3);
  c.save(); c.translate(900, 830); c.rotate(0.35); stool(c, -110, 0, 2); c.restore();
  arc(c, 800, 560, 190, Math.PI * 1.15, Math.PI * 1.75);
  write(c, "3", 240, 900, 110); write(c, "2", 820, 900, 110);
};

export const ic_animalsAnimalsAroundUsL2 = cards("sci.animals.animals-around-us.L2 cards", [e1, e2, a2, a3, a5, p1, balance, coverings, wingsFins, standing]);
