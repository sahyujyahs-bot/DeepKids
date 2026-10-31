import type { Ctx } from "./core";
import { INK, SH, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, rrect, shadow, shade, line, shine, arrow, bowl, leaf, hand, write, cards, rnd } from "./flatKit";

// sci.habitats.habitats.L3 set-up cards: curd in three places (e4), five places in a garden (e2), a bag on a tree (e3).
const MILK = "#fbf6e6", CURD = "#fffefa", LCD = "#c9f06b", SCREEN = "#22303a", TERRA = "#c4703d", TERRA_DK = "#9c5128", TOWEL = "#f7f3e8", STRING = "#7a4cb0";
const TAG = { warm: COL.red, room: COL.yellow, cold: COL.blue };

// a long sleeve from the cuff back to the edge of the card, so an arm never starts from nowhere
const arm = (c: Ctx, x: number, y: number, an: number, s: number, cloth: string = CLOTH.child) => {
  const dx = Math.cos(an), dy = Math.sin(an), p = [[x - dx * 50 * s, y - dy * 50 * s], [x - dx * 900, y - dy * 900]];
  line(c, p, 72 * s + 12, INK); line(c, p, 72 * s, cloth);
};
const childHand = (c: Ctx, x: number, y: number, an: number, s: number) => { arm(c, x, y, an, s); hand(c, x, y, an, s); };
const adultHand = (c: Ctx, x: number, y: number, an: number, s: number) => { arm(c, x, y, an, s, CLOTH.adult); hand(c, x, y, an, s, SKIN.adult, CLOTH.adult); };

const sun = (c: Ctx, x: number, y: number, r: number, col: string = COL.yellow) => {
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6, p = [[x + Math.cos(a) * (r + 18), y + Math.sin(a) * (r + 18)], [x + Math.cos(a) * (r + 52), y + Math.sin(a) * (r + 52)]]; line(c, p, 15, INK); line(c, p, 7, col); }
  shape(c, () => ell(c, x, y, r, r), col, 6);
};

// the digital thermometer: steel probe, teal body, a screen. Local +x runs from the probe tip to the end of the body.
const thermo = (c: Ctx, x: number, y: number, ang: number, s: number, reading: string, rs = 34, shadowOn = true) => {
  c.save(); c.translate(x, y); c.rotate(ang); c.scale(s, s);
  if (shadowOn) { c.save(); c.translate(12, 18); c.fillStyle = SH; c.beginPath(); rrect(c, 200, -42, 520, 84, 26); c.fill(); line(c, [[0, 0], [210, 0]], 14, SH); c.restore(); }
  line(c, [[0, 0], [210, 0]], 26, INK); line(c, [[6, 0], [210, 0]], 13, COL.steel);
  const body = () => rrect(c, 200, -42, 520, 84, 26);
  shape(c, body, COL.teal); shade(c, body, COL.tealDk, -6, -16);
  shape(c, () => rrect(c, 240, -29, 215, 58, 10), SCREEN, 5);
  write(c, reading, 262, -rs * 0.5, rs, LCD, 6);
  shape(c, () => ell(c, 580, 0, 24, 24), COL.steelIn, 5);
  c.restore();
};

// pot with soil, a plant stem rises from y = 838
const pot = (c: Ctx, cx: number) => {
  shadow(c, cx + 30, 1052, 310, 26);
  const body = () => { c.moveTo(cx - 250, 905); c.lineTo(cx + 250, 905); c.lineTo(cx + 205, 1042); c.lineTo(cx - 205, 1042); c.closePath(); };
  shape(c, body, TERRA); shade(c, body, TERRA_DK, -20, -8);
  const rim = () => rrect(c, cx - 280, 835, 560, 80, 16);
  shape(c, rim, TERRA); shade(c, rim, TERRA_DK, -14, -10);
  shape(c, () => ell(c, cx, 838, 262, 22), COL.soil, 6);
};
// a leafy hibiscus branch standing in the pot
const branch = (c: Ctx, x: number, top: number, flower = true) => {
  for (let y = 730, i = 0; y > top + 30; y -= 75, i++) leaf(c, x, y, 125, i % 2 ? -0.8 : -2.34, i % 3 ? COL.leaf : COL.greenLt);
  line(c, [[x, 838], [x, top]], 18, INK); line(c, [[x, 838], [x, top]], 9, COL.leafDk);
  if (flower) {
    for (let k = 0; k < 5; k++) { const a = (k * Math.PI * 2) / 5 - Math.PI / 2; shape(c, () => ell(c, x + Math.cos(a) * 34, top + Math.sin(a) * 34, 28, 28), COL.pink, 5); }
    shape(c, () => ell(c, x, top, 15, 15), COL.yellow, 4);
  }
};
const stick = (c: Ctx, x: number, top: number) => {
  const st = (pts: number[][], w: number) => { line(c, pts, w + 8, INK); line(c, pts, w, COL.brown); };
  st([[x, 838], [x, top]], 12); st([[x, top + 150], [x - 70, top + 60]], 8); st([[x, top + 90], [x + 66, top + 10]], 8);
};
// a clear bag, closed at the top, neck at (nx, ny) at the bottom; mist 0..1 fogs the inside
const bag = (c: Ctx, nx: number, ny: number, w: number, h: number, mist = 0, pool = false) => {
  const p = () => { c.moveTo(nx - 22, ny); c.bezierCurveTo(nx - w * 0.78, ny - h * 0.12, nx - w * 0.62, ny - h, nx, ny - h); c.bezierCurveTo(nx + w * 0.62, ny - h, nx + w * 0.78, ny - h * 0.12, nx + 22, ny); c.closePath(); };
  shape(c, p, COL.glass, 5);
  if (mist) shape(c, p, `rgba(255,255,255,${mist})`, 0);
  if (pool) { c.save(); c.beginPath(); p(); c.clip(); c.beginPath(); c.moveTo(nx - w, ny - 80); c.quadraticCurveTo(nx, ny - 112, nx + w, ny - 80); c.lineTo(nx + w, ny + 5); c.lineTo(nx - w, ny + 5); c.closePath(); c.fillStyle = COL.water; c.fill(); c.beginPath(); c.moveTo(nx - w, ny - 80); c.quadraticCurveTo(nx, ny - 112, nx + w, ny - 80); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); c.restore(); }
  shape(c, p, "rgba(0,0,0,0)", 5);
  for (const k of [-1, 1]) line(c, [[nx + k * 22, ny], [nx + k * 36, ny - 34]], 4);
  shine(c, [[nx - w * 0.42, ny - h * 0.8], [nx - w * 0.5, ny - h * 0.38]], 11);
};
const tie = (c: Ctx, nx: number, ny: number) => {
  for (let k = 0; k < 3; k++) { const p = [[nx - 27, ny + k * 11], [nx + 27, ny + k * 11 + 4]]; line(c, p, 12, INK); line(c, p, 6, STRING); }
  for (const e of [[nx + 62, ny + 62], [nx + 20, ny + 66]]) { const p = [[nx + 27, ny + 20], e]; line(c, p, 11, INK); line(c, p, 5, STRING); }
  shape(c, () => ell(c, nx + 27, ny + 20, 12, 12), STRING, 4);
};
const wheelClock = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), WHITE, 7);
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78], [x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9]], 5); }
  line(c, [[x, y], [x, y - r * 0.72]], 7); line(c, [[x, y], [x + r * 0.28, y - r * 0.4]], 9);
  shape(c, () => ell(c, x, y, 7, 7), INK, 0);
};

// ---- curd cards
const spoon = (c: Ctx, x1: number, y1: number, x2: number, y2: number, load: "curd" | "lump" | "") => {
  const an = Math.atan2(y2 - y1, x2 - x1);
  line(c, [[x1, y1], [x2, y2]], 22, INK); line(c, [[x1, y1], [x2, y2]], 11, COL.steel);
  c.save(); c.translate(x2, y2); c.rotate(an);
  shape(c, () => ell(c, 0, 0, 66, 40), COL.steel); shape(c, () => ell(c, 4, 0, 52, 28), COL.steelIn, 3);
  if (load === "curd") shape(c, () => ell(c, 4, -4, 38, 22), CURD, 4);
  if (load === "lump") shape(c, () => rrect(c, -34, -44, 80, 42, 12), CURD, 5);
  c.restore();
};
const tentCard = (c: Ctx, x: number, y: number, col: string, icon: "waves" | "dot" | "snow") => {
  shadow(c, x + 14, y + 4, 70, 12);
  shape(c, () => rrect(c, x - 62, y - 122, 124, 122, 10), WHITE, 6);
  shape(c, () => ell(c, x, y - 62, 38, 38), col, 5);
  if (icon === "waves") for (const dx of [-12, 12]) line(c, [[x + dx, y - 86], [x + dx - 8, y - 74], [x + dx + 8, y - 62], [x + dx - 8, y - 50], [x + dx, y - 38]], 5, WHITE);
  if (icon === "dot") shape(c, () => ell(c, x, y - 62, 10, 10), INK, 0);
  if (icon === "snow") for (let k = 0; k < 3; k++) { const a = (k * Math.PI) / 3; line(c, [[x - Math.cos(a) * 26, y - 62 - Math.sin(a) * 26], [x + Math.cos(a) * 26, y - 62 + Math.sin(a) * 26]], 5, WHITE); }
};
const casserole = (c: Ctx, cx: number, y: number, s: number) => {
  shadow(c, cx + 20 * s, y + 172 * s, 150 * s, 20 * s);
  for (const sx of [-1, 1]) shape(c, () => rrect(c, cx + sx * 150 * s - 28 * s, y + 40 * s, 56 * s, 34 * s, 12 * s), COL.teal);
  const body = () => rrect(c, cx - 135 * s, y, 270 * s, 170 * s, 34 * s);
  shape(c, body, COL.teal); shade(c, body, COL.tealDk, -14 * s, -14 * s);
  const tw = () => { c.moveTo(cx - 125 * s, y + 12 * s); c.bezierCurveTo(cx - 135 * s, y - 100 * s, cx + 135 * s, y - 100 * s, cx + 125 * s, y + 12 * s); c.closePath(); };
  shape(c, tw, TOWEL);
  c.save(); c.beginPath(); tw(); c.clip(); for (let k = -4; k <= 4; k++) line(c, [[cx + k * 28 * s, y - 100 * s], [cx + k * 28 * s, y + 20 * s]], 7 * s, COL.red); c.restore();
  shape(c, tw, "rgba(0,0,0,0)", 6);
  shape(c, () => ell(c, cx, y - 52 * s, 72 * s, 20 * s), COL.steel, 5); shape(c, () => ell(c, cx, y - 56 * s, 56 * s, 13 * s), COL.steelIn, 3);
};
const coveredBowl = (c: Ctx, x: number, y: number, r: number) => {
  bowl(c, x, y, r);
  shape(c, () => ell(c, x, y - 4, r * 1.07, r * 0.25), COL.steel, 6); shape(c, () => ell(c, x, y - 8, r * 0.85, r * 0.17), COL.steelIn, 3);
};

// e4 step 0: pour warm milk into three bowls, one spoon of curd in each
// setup.e4.0
const su_e4_0 = (c: Ctx) => {
  ground(c);
  for (const x of [200, 540, 880]) bowl(c, x, 800, 135, MILK);
  // the pan, tilted, and its handle
  c.save(); c.translate(400, 340); c.rotate(0.5);
  shape(c, () => rrect(c, -300, -18, 180, 36, 12), COL.woodDk);
  const body = () => rrect(c, -130, -85, 260, 170, 22);
  shape(c, body, COL.steel); shade(c, body, COL.steelDk, -16, -16);
  shape(c, () => ell(c, 0, -85, 130, 22), MILK, 6);
  c.restore();
  shape(c, () => { c.moveTo(540, 288); c.quadraticCurveTo(585, 500, 560, 790); c.lineTo(525, 790); c.quadraticCurveTo(552, 520, 520, 300); c.closePath(); }, MILK, 5);
  shape(c, () => ell(c, 542, 800, 58, 14), MILK, 4);
  arrow(c, [[660, 430], [660, 620]]);
  adultHand(c, 94, 163, 0.5, 1.7);
  // the child's spoon with one spoon of curd
  spoon(c, 934, 384, 855, 622, "curd");
  childHand(c, 969, 273, 1.9, 1.7);
};

// e4 step 1: warm / counter / fridge
// setup.e4.1
const su_e4_1 = (c: Ctx) => {
  const y0 = 660;
  const panel = (x0: number, bg: string, top: string, front: string, under: string) => {
    c.fillStyle = bg; c.fillRect(x0, 0, 360, 1080);
    c.fillStyle = under; c.fillRect(x0, y0 + 190, 360, 1080);
    c.fillStyle = top; c.fillRect(x0, y0, 360, 190);
    c.fillStyle = front; c.fillRect(x0, y0 + 190, 360, 26);
    line(c, [[x0, y0], [x0 + 360, y0]], 6); line(c, [[x0, y0 + 190], [x0 + 360, y0 + 190]], 6); line(c, [[x0, y0 + 216], [x0 + 360, y0 + 216]], 5);
  };
  panel(0, "#f8dfb0", "#e6c07a", "#c99a4f", "#d8b36e");
  panel(360, "#f3ead8", "#e0cfa6", "#bfa878", "#ccb88c");
  panel(720, "#cfe6f2", "#eaf6fb", "#a9cfe2", "#bcdbeb");
  line(c, [[360, 0], [360, 1080]], 10); line(c, [[720, 0], [720, 1080]], 10);
  // warm: waves rising; cold: snowflake
  for (const dx of [-70, 0, 70]) line(c, [[180 + dx, 400], [172 + dx, 370], [188 + dx, 340], [172 + dx, 310], [180 + dx, 280]], 12, COL.red);
  for (let k = 0; k < 3; k++) { const a = (k * Math.PI) / 3; line(c, [[900 - Math.cos(a) * 70, 330 - Math.sin(a) * 70], [900 + Math.cos(a) * 70, 330 + Math.sin(a) * 70]], 12, COL.blue); }
  casserole(c, 180, 498, 0.95);
  coveredBowl(c, 540, 585, 130);
  coveredBowl(c, 900, 585, 130);
  tentCard(c, 180, 840, TAG.warm, "waves"); tentCard(c, 540, 840, TAG.room, "dot"); tentCard(c, 900, 840, TAG.cold, "snow");
};

// a cut-open bowl tilted by ang; its contents are runny (level), thick (half way) or set (tilt with the bowl)
const tiltBowl = (c: Ctx, x: number, y: number, r: number, ang: number, kind: "set" | "thick" | "runny", tag: string) => {
  c.save(); c.translate(x, y); c.rotate(ang);
  const d = r * 0.9, p = () => { c.moveTo(-r, 0); c.bezierCurveTo(-r * 0.95, d * 1.3, r * 0.95, d * 1.3, r, 0); c.closePath(); };
  shape(c, p, COL.steel); shade(c, p, COL.steelDk, -r * 0.2, -r * 0.1);
  c.restore();
  // contents in world space, clipped to the bowl
  c.save(); c.translate(x, y); c.rotate(ang); c.beginPath(); p(); c.clip(); c.rotate(-ang);
  const qx = r * Math.cos(ang), qy = r * Math.sin(ang), n = kind === "set" ? 7 : kind === "thick" ? 14 : 12;
  const off = kind === "set" ? [-n * Math.sin(ang), n * Math.cos(ang)] : [0, n], beta = kind === "set" ? ang : kind === "thick" ? ang * 0.5 : 0;
  const ox = qx + off[0], oy = qy + off[1], t = Math.tan(beta);
  c.beginPath(); c.moveTo(ox - 800, oy - 800 * t); c.lineTo(ox + 800, oy + 800 * t); c.lineTo(ox + 800, oy + 2000); c.lineTo(ox - 800, oy + 2000); c.closePath();
  c.fillStyle = kind === "runny" ? MILK : CURD; c.fill();
  line(c, [[ox - 800, oy - 800 * t], [ox + 800, oy + 800 * t]], 5);
  c.restore();
  c.save(); c.translate(x, y); c.rotate(ang);
  shape(c, p, "rgba(0,0,0,0)", 7);
  shape(c, () => ell(c, -r * 0.5, d * 0.62, 20, 20), tag, 5);
  c.restore();
  if (kind === "runny") {
    const rx = x + qx, ry = y + qy;
    shape(c, () => { c.moveTo(rx - 14, ry - 4); c.quadraticCurveTo(rx + 36, ry - 8, rx + 42, ry + 50); c.lineTo(rx + 42, 700); c.lineTo(rx + 18, 700); c.lineTo(rx + 20, ry + 50); c.quadraticCurveTo(rx + 12, ry + 14, rx - 14, ry + 14); c.closePath(); }, MILK, 5);
    shape(c, () => ell(c, rx + 32, 706, 62, 14), MILK, 5);
  }
};

// e4 step 2: tilt each bowl, runny / thick / set
// setup.e4.2
const su_e4_2 = (c: Ctx) => {
  ground(c);
  const a = 0.5, r = 135, y = 440;
  ([[165, "set", TAG.warm], [505, "thick", TAG.room], [835, "runny", TAG.cold]] as [number, "set" | "thick" | "runny", string][]).forEach(([x, k, tag]) => {
    tiltBowl(c, x, y, r, a, k, tag);
    arrow(c, [[x - 70, 285], [x + 10, 245], [x + 100, 280]]);
    childHand(c, x - 92, 705, -1.3, 1.7);
  });
};

// e4 step 3: put the fridge bowl in the warm casserole; evening, set curd on a tilted spoon
// setup.e4.3
const su_e4_3 = (c: Ctx) => {
  const y0 = 700;
  c.fillStyle = "#f8dfb0"; c.fillRect(0, 0, 540, 1080); c.fillStyle = "#f9d3b4"; c.fillRect(540, 0, 540, 1080);
  c.fillStyle = "#e6c07a"; c.fillRect(0, y0, 540, 380); c.fillStyle = "#e9b98f"; c.fillRect(540, y0, 540, 380);
  line(c, [[0, y0], [1080, y0]], 6); line(c, [[540, 0], [540, 1080]], 10);
  for (const dx of [-60, 0, 60]) line(c, [[270 + dx, 330], [262 + dx, 300], [278 + dx, 270], [262 + dx, 240], [270 + dx, 210]], 12, COL.red);
  casserole(c, 270, 560, 1.15);
  tentCard(c, 270, 900, TAG.cold, "snow");
  sun(c, 640, 160, 46, COL.orange);
  bowl(c, 790, 650, 175, CURD);
  shape(c, () => ell(c, 740, 652, 70, 11), "#e9e3cf", 0);
  shape(c, () => ell(c, 700, 700, 22, 22), TAG.cold, 5);
  spoon(c, 940, 262, 690, 480, "lump");
  childHand(c, 935, 262, 2.4, 1.4);
  arrow(c, [[400, 940], [700, 940]]);
};

// ---- garden cards
// e2 step 0: thermometer on the sunny path for 2 minutes
// setup.e2.0
const su_e2_0 = (c: Ctx) => {
  ground(c, "#e9d3a0");
  c.fillStyle = COL.green; c.fillRect(0, 0, 1080, 160); c.fillRect(0, 930, 1080, 150);
  line(c, [[0, 160], [1080, 160]], 6); line(c, [[0, 930], [1080, 930]], 6);
  const r = rnd(5);
  for (let i = 0; i < 26; i++) { const x = r() * 1080, y = 190 + r() * 710; shape(c, () => ell(c, x, y, 8 + r() * 8, 6 + r() * 4, r()), "#cfb27a", 3); }
  for (let i = 0; i < 18; i++) { const x = 30 + i * 60; leaf(c, x, 160, 40 + (i % 3) * 8, -1.2 + (i % 2) * 0.5, COL.greenDk); leaf(c, x + 20, 940, 36, 1.2 - (i % 2) * 0.5, COL.greenDk); }
  sun(c, 120, 80, 42);
  thermo(c, 110, 440, 0.05, 1.2, "38°c", 34);
  // the phone with a 2 minute timer
  c.save(); c.translate(720, 760); c.rotate(-0.05);
  c.fillStyle = SH; c.beginPath(); rrect(c, -113, -197, 250, 430, 34); c.fill();
  shape(c, () => rrect(c, -125, -215, 250, 430, 34), COL.black, 6);
  shape(c, () => rrect(c, -108, -196, 216, 392, 22), "#f3f7fb", 4);
  c.beginPath(); c.arc(0, -30, 80, 0, Math.PI * 2); c.strokeStyle = "#d5dde6"; c.lineWidth = 20; c.stroke();
  c.beginPath(); c.arc(0, -30, 80, -Math.PI / 2, Math.PI); c.strokeStyle = COL.blue; c.lineWidth = 20; c.lineCap = "round"; c.stroke();
  write(c, "2", -21, -66, 70, INK, 9);
  shape(c, () => ell(c, 0, 135, 36, 36), COL.teal, 5);
  line(c, [[-10, 120], [-10, 150]], 8, WHITE); line(c, [[10, 120], [10, 150]], 8, WHITE);
  c.restore();
};

// e2 step 1: lift a stone, thermometer in the damp soil under it
// setup.e2.1
const su_e2_1 = (c: Ctx) => {
  ground(c, "#dff0f7");
  c.fillStyle = COL.soil; c.fillRect(0, 650, 1080, 430);
  c.fillStyle = COL.soilDk; c.fillRect(190, 650, 520, 430);
  const rr = rnd(9);
  for (let i = 0; i < 14; i++) shape(c, () => ell(c, 220 + rr() * 480, 680 + rr() * 330, 11, 7), COL.drop, 2.5);
  c.fillStyle = COL.green; c.fillRect(0, 618, 190, 36); c.fillRect(710, 618, 370, 36);
  for (let i = 0; i < 6; i++) { leaf(c, 20 + i * 30, 622, 46, -1.57 + (i % 2) * 0.4, COL.leaf); leaf(c, 730 + i * 58, 622, 46, -1.57 - (i % 2) * 0.4, COL.leaf); }
  line(c, [[0, 650], [190, 650]], 6); line(c, [[710, 650], [1080, 650]], 6);
  thermo(c, 455, 795, -1.3, 0.65, "24°c", 40, false);
  // the stone, hinged on the ground at its left end and lifted
  c.save(); c.translate(190, 650); c.rotate(-0.8);
  const st = () => rrect(c, 0, -70, 560, 70, 26);
  shape(c, st, COL.grey); shade(c, st, COL.greyDk, -12, -18, 0.5);
  line(c, [[120, -40], [170, -20]], 4, COL.greyDk);
  c.restore();
  arrow(c, [[860, 520], [860, 380]]);
  childHand(c, 640, 212, 2.9, 1.4);
};

const ant = (c: Ctx, x: number, y: number, s: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  for (const dx of [-8, 2, 12]) { line(c, [[dx, 0], [dx - 6, -20]], 4); line(c, [[dx, 0], [dx - 6, 20]], 4); }
  line(c, [[24, -4], [38, -16]], 3); line(c, [[24, 4], [38, 16]], 3);
  shape(c, () => ell(c, -22, 0, 17, 12), "#6b3f2a", 4); shape(c, () => ell(c, 0, 0, 12, 9), "#6b3f2a", 4); shape(c, () => ell(c, 20, 0, 10, 9), "#6b3f2a", 4);
  c.restore();
};
const beetle = (c: Ctx, x: number, y: number, s: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  for (const dx of [-12, 0, 12]) { line(c, [[dx, 0], [dx - 4, -30]], 4); line(c, [[dx, 0], [dx - 4, 30]], 4); }
  shape(c, () => ell(c, 0, 0, 30, 24), "#3a3f6b", 4); line(c, [[-30, 0], [28, 0]], 3, "#7f86c9"); shape(c, () => ell(c, 34, 0, 11, 10), "#3a3f6b", 4);
  c.restore();
};
const woodlouse = (c: Ctx, x: number, y: number, s: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  for (const dx of [-18, -6, 6, 18]) { line(c, [[dx, 0], [dx - 3, -26]], 4); line(c, [[dx, 0], [dx - 3, 26]], 4); }
  shape(c, () => ell(c, 0, 0, 34, 22), COL.grey, 4);
  for (const dx of [-16, -2, 12]) line(c, [[dx, -20], [dx, 20]], 3, COL.greyDk);
  c.restore();
};
const ladybird = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x + r * 0.9, y, r * 0.38, r * 0.34), INK, 0);
  shape(c, () => ell(c, x, y, r, r * 0.88), COL.red, 7);
  line(c, [[x - r * 0.95, y], [x + r * 0.95, y]], 6);
  for (const [dx, dy] of [[-0.35, -0.4], [-0.35, 0.4], [0.2, -0.5], [0.2, 0.5], [-0.65, 0]]) shape(c, () => ell(c, x + dx * r, y + dy * r, r * 0.14, r * 0.14), INK, 0);
};

// e2 step 2: magnifying glass over a leaf pile, tally in a notebook
// setup.e2.2
const su_e2_2 = (c: Ctx) => {
  ground(c);
  shadow(c, 400, 835, 280, 36);
  const r = rnd(21), cols = [COL.orange, COL.yellow, COL.leaf, COL.brown, COL.red, COL.greenLt];
  for (let i = 0; i < 36; i++) leaf(c, 190 + r() * 330, 790 + r() * 45, 190 + r() * 60, -2.9 + r() * 2.3, cols[i % cols.length]);
  ant(c, 240, 735, 2.1, 0.4); ant(c, 560, 770, 2.1, 3.5); beetle(c, 360, 790, 1.7, 0.3); woodlouse(c, 610, 690, 1.6, -0.4);
  // the lens, with a ladybird seen big inside
  c.save(); c.beginPath(); ell(c, 420, 480, 150, 150); c.clip();
  c.fillStyle = COL.greenLt; c.fillRect(250, 310, 340, 340);
  line(c, [[270, 600], [570, 380]], 8, COL.leafDk); line(c, [[400, 520], [330, 400]], 5, COL.leafDk);
  ladybird(c, 410, 480, 95);
  c.restore();
  const hnd = [[552, 381], [800, 195]];
  line(c, hnd, 34, INK); line(c, hnd, 20, COL.woodDk);
  c.beginPath(); ell(c, 420, 480, 164, 164); c.strokeStyle = INK; c.lineWidth = 36; c.stroke();
  c.beginPath(); ell(c, 420, 480, 164, 164); c.strokeStyle = COL.steel; c.lineWidth = 24; c.stroke();
  shine(c, [[330, 380], [380, 340]], 9);
  childHand(c, 808, 191, 2.49, 1.4);
  // the notebook with five tally strokes
  c.save(); c.translate(840, 840); c.rotate(0.06);
  c.fillStyle = SH; c.beginPath(); rrect(c, -135, -165, 320, 360, 14); c.fill();
  shape(c, () => rrect(c, -150, -180, 320, 360, 14), COL.paper, 6);
  shape(c, () => rrect(c, -150, -180, 40, 360, 12), COL.red, 6);
  for (let k = 0; k < 6; k++) line(c, [[-96, -120 + k * 52], [150, -120 + k * 52]], 3, COL.sky);
  for (let k = 0; k < 4; k++) line(c, [[-50 + k * 34, -140], [-50 + k * 34, -60]], 9);
  line(c, [[-70, -78], [70, -118]], 9);
  c.restore();
};

// ---- tree-water cards
// e3 step 0: slip the bag over a leafy stem
// setup.e3.0
const su_e3_0 = (c: Ctx) => {
  ground(c, "#e9f3f8");
  sun(c, 940, 110, 46);
  pot(c, 540);
  branch(c, 540, 300);
  const p = () => { c.moveTo(350, 560); c.bezierCurveTo(330, 300, 420, 130, 540, 130); c.bezierCurveTo(660, 130, 750, 300, 730, 560); c.quadraticCurveTo(540, 610, 350, 560); c.closePath(); };
  shape(c, p, COL.glass, 5);
  shape(c, () => ell(c, 540, 562, 190, 34), "rgba(214,236,250,0.5)", 5);
  shine(c, [[400, 250], [380, 420]], 11);
  arrow(c, [[860, 250], [860, 450]]);
  childHand(c, 299, 210, 0.2, 1.4);
};

// e3 step 1: tie the bag at the stem; a second bag over a bare stick
// setup.e3.1
const su_e3_1 = (c: Ctx) => {
  ground(c, "#e9f3f8");
  pot(c, 540);
  branch(c, 330, 330, false); stick(c, 750, 330);
  bag(c, 330, 745, 380, 520); bag(c, 750, 745, 380, 520);
  tie(c, 330, 745); tie(c, 750, 745);
  childHand(c, 218, 748, 0, 1.6);
};

// e3 step 2: after an hour, mist and drops in the leafy bag, the stick bag clear
// setup.e3.2
const su_e3_2 = (c: Ctx) => {
  ground(c, "#e9f3f8");
  wheelClock(c, 540, 115, 80);
  pot(c, 540);
  branch(c, 330, 330, false); stick(c, 750, 330);
  bag(c, 330, 745, 380, 520, 0.3, true); bag(c, 750, 745, 380, 520);
  const rr = rnd(3);
  for (let i = 0; i < 16; i++) { const x = 205 + rr() * 250, y = 330 + rr() * 330; shape(c, () => ell(c, x, y, 9, 13), COL.drop, 3.5); }
  shine(c, [[790, 300], [770, 450]], 11);
  tie(c, 330, 745); tie(c, 750, 745);
};

export const su_habitatsHabitats = cards("sci.habitats.habitats.L3 set-up", [su_e4_0, su_e4_1, su_e4_2, su_e4_3, su_e2_0, su_e2_1, su_e2_2, su_e3_0, su_e3_1, su_e3_2]);
