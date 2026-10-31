import type { Ctx } from "./core";
import { D, INK, WHITE, COL, SKIN, CLOTH, SH, rnd, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, plate, write, cards } from "./flatKit";

// BIOMIMICRY L3 set-up cards: water on leaf / steel / paper (e1), dough shapes dropped in water (e2), cup houses with ice (e3).
const TABLE = "#e6d3b0", DOUGH = "#efd29a", DOUGHDK = "#d2ae6a", NEWS = "#f3efe6";

// ---------------------------------------------------------------- shared things
// a chembu (taro) leaf seen from above: heart shape, tip towards +x after rotation; centre (x, y), scale s
const chembuPath = (c: Ctx) => { c.moveTo(0, -70); c.bezierCurveTo(-30, -130, -150, -120, -140, -10); c.bezierCurveTo(-130, 70, -50, 110, 0, 160); c.bezierCurveTo(50, 110, 130, 70, 140, -10); c.bezierCurveTo(150, -120, 30, -130, 0, -70); c.closePath(); };
const chembu = (c: Ctx, x: number, y: number, s: number, rot: number, dust?: (c: Ctx) => void) => {
  c.save(); c.translate(x, y); c.rotate(rot - Math.PI / 2); c.scale(s, s);
  const body = () => chembuPath(c);
  shape(c, body, COL.leaf, 5 / s);
  shade(c, body, COL.leafDk, 22, 18, 0.5);
  for (const [vx, vy] of [[0, 140], [-100, 40], [100, 40], [-110, -50], [110, -50]]) line(c, [[0, -30], [vx, vy]], 3 / s, COL.leafDk);
  if (dust) { c.save(); c.beginPath(); body(); c.clip(); dust(c); c.restore(); }
  c.restore();
};
// a tulsi leaf from above: small pointed oval with a stalk, tip up at rotation 0
const tulsi = (c: Ctx, x: number, y: number, s: number, rot: number) => {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  line(c, [[0, 60], [0, 130]], 6 / s, INK); line(c, [[0, 60], [0, 130]], 3 / s, COL.greenDk);
  const body = () => { c.moveTo(0, 70); c.bezierCurveTo(-85, 30, -70, -60, 0, -100); c.bezierCurveTo(70, -60, 85, 30, 0, 70); c.closePath(); };
  shape(c, body, COL.greenLt, 5 / s); shade(c, body, COL.green, 16, 12, 0.55);
  line(c, [[0, 62], [0, -80]], 3 / s, COL.greenDk);
  for (const k of [-30, 0, 30]) { line(c, [[0, k], [-40, k - 22]], 2.5 / s, COL.greenDk); line(c, [[0, k], [40, k - 22]], 2.5 / s, COL.greenDk); }
  c.restore();
};
// a water drop bead standing on a surface: bottom centre (x, y), half width rx, height h
const bead = (c: Ctx, x: number, y: number, rx: number, h: number) => {
  shadow(c, x + rx * 0.35, y + 4, rx * 1.05, 8);
  const body = () => { c.moveTo(x - rx, y); c.bezierCurveTo(x - rx * 1.05, y - h * 1.3, x + rx * 1.05, y - h * 1.3, x + rx, y); c.closePath(); };
  shape(c, body, COL.water, 5);
  shade(c, body, COL.waterDk, rx * 0.35, -h * 0.05, 0.7);
  shine(c, [[x - rx * 0.55, y - h * 0.55], [x - rx * 0.3, y - h * 0.85]], Math.max(6, rx * 0.12));
};

// a round ball of water resting on a surface: bottom centre (x, y), radius r
const ballDrop = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.35, y + 4, r * 1.05, 8);
  shape(c, () => ell(c, x, y - r, r, r), COL.water, 5);
  shade(c, () => ell(c, x, y - r, r, r), COL.waterDk, r * 0.3, r * 0.3, 0.7);
  shine(c, [[x - r * 0.55, y - r * 1.2], [x - r * 0.3, y - r * 1.6]], Math.max(6, r * 0.12));
};

// dough shapes (atta): pancake, ball, cone. (x, y) is where each rests on the plate (bottom centre)
const pancake = (c: Ctx, x: number, y: number, s = 1) => {
  shadow(c, x + 14 * s, y + 4, 140 * s, 24 * s);
  const body = () => { c.moveTo(x - 120 * s, y - 36 * s); c.lineTo(x - 120 * s, y - 6 * s); c.bezierCurveTo(x - 110 * s, y + 24 * s, x + 110 * s, y + 24 * s, x + 120 * s, y - 6 * s); c.lineTo(x + 120 * s, y - 36 * s); c.closePath(); };
  shape(c, body, DOUGH, 5); shade(c, body, DOUGHDK, 30 * s, 0, 0.6);
  shape(c, () => ell(c, x, y - 36 * s, 120 * s, 40 * s), DOUGH, 5);
  shade(c, () => ell(c, x, y - 36 * s, 120 * s, 40 * s), DOUGHDK, 26 * s, 12 * s, 0.5);
  shine(c, [[x - 80 * s, y - 46 * s], [x - 30 * s, y - 60 * s]], 7);
};
const ball = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.2, y + 2, r * 1.0, r * 0.22);
  shape(c, () => ell(c, x, y - r, r, r), DOUGH, 5); shade(c, () => ell(c, x, y - r, r, r), DOUGHDK, r * 0.4, r * 0.35, 0.6);
  shine(c, [[x - r * 0.6, y - r * 1.2], [x - r * 0.3, y - r * 1.55]], 8);
};
// a long cone ("beak"); tipDown = point down (for dropping), base centre at (x, y)
const cone = (c: Ctx, x: number, y: number, h: number, w: number, tipDown = false) => {
  c.save(); c.translate(x, y); if (tipDown) { c.scale(1, -1); }
  if (!tipDown) shadow(c, 18, 4, w * 0.9, 20);
  const body = () => { c.moveTo(-w, 0); c.bezierCurveTo(-w, -h * 0.4, -w * 0.25, -h * 0.75, 0, -h); c.bezierCurveTo(w * 0.25, -h * 0.75, w, -h * 0.4, w, 0); c.bezierCurveTo(w * 0.7, 28, -w * 0.7, 28, -w, 0); c.closePath(); };
  shape(c, body, DOUGH, 5); shade(c, body, DOUGHDK, w * 0.5, 0, 0.6);
  line(c, [[-w * 0.55, -h * 0.25], [-w * 0.3, -h * 0.55]], 7, "rgba(255,255,255,0.75)");
  c.restore();
};
// a sheet of newspaper, flat on the table seen from the front-top: quad corners, with lines of print
const news = (c: Ctx, q: number[][]) => {
  shape(c, () => polyP(c, q), NEWS, 5);
  const lerp = (a: number[], b: number[], t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  for (let k = 1; k < 9; k++) { const t = k / 9; const a = lerp(q[0], q[3], t), b = lerp(q[1], q[2], t); const a2 = lerp(a, b, 0.06), b2 = lerp(a, b, k % 3 === 0 ? 0.6 : 0.94); line(c, [a2, b2], 4, COL.grey); }
};

// ---------------------------------------------------------------- e1: leaf, steel, paper
// setup.e1.0
const e1_0 = (c: Ctx) => {
  ground(c, TABLE);
  shadow(c, 450, 880, 400, 30);
  shape(c, () => rrect(c, 60, 180, 720, 680, 44), COL.steel, 7);
  shape(c, () => rrect(c, 96, 216, 648, 608, 30), COL.steelIn, 5);
  shade(c, () => rrect(c, 96, 216, 648, 608, 30), COL.steelDk, 14, 14, 0.35);
  chembu(c, 270, 420, 1.15, Math.PI / 2 + 0.1);
  tulsi(c, 600, 360, 1.35, 0.35);
  // paper sheet
  c.save(); c.translate(260, 700); c.rotate(-0.05);
  shadow(c, 14, 90, 140, 16);
  shape(c, () => rrect(c, -130, -82, 260, 164, 6), WHITE, 5);
  c.restore();
  // steel plate
  plate(c, 590, 700, 135, 100);
  // dropper lying beside the tray
  c.save(); c.translate(900, 520); c.rotate(0.05);
  shadow(c, 20, 20, 36, 270);
  shape(c, () => rrect(c, -24, -150, 48, 250, 18), COL.glass, 5);
  shape(c, () => rrect(c, -14, 20, 28, 76, 12), COL.water, 0);
  shape(c, () => { c.moveTo(-24, 98); c.lineTo(24, 98); c.lineTo(4, 160); c.lineTo(-4, 160); c.closePath(); }, COL.glass, 5);
  shape(c, () => ell(c, 0, -170, 36, 56), COL.purple, 5);
  shade(c, () => ell(c, 0, -170, 36, 56), "#6a4fa8", 14, 0, 0.5);
  shine(c, [[-12, 0], [-12, 80]], 6);
  c.restore();
};

// setup.e1.1
const e1_1 = (c: Ctx) => {
  ground(c, TABLE);
  const ty = 840;
  c.fillStyle = "#d9c39c"; c.fillRect(0, ty, D, D - ty);
  line(c, [[0, ty], [D, ty]], 6);
  for (const x of [200, 540, 900]) shadow(c, x + 40, ty + 14, 150, 14);
  // chembu leaf, side on: a green slab with its stalk, and a round ball of water on it
  const leafP = () => { c.moveTo(70, ty); c.lineTo(70, ty - 26); c.quadraticCurveTo(200, ty - 56, 330, ty - 26); c.lineTo(330, ty); c.closePath(); };
  shape(c, () => rrect(c, 8, ty - 20, 70, 14, 6), COL.greenDk, 5);
  shape(c, leafP, COL.leaf, 6); shade(c, leafP, COL.leafDk, 0, 10, 0.5);
  ballDrop(c, 200, ty - 41, 62);
  // steel plate slab with a low dome of water
  const stP = () => rrect(c, 395, ty - 30, 290, 30, 10);
  shape(c, stP, COL.steel, 6); shade(c, stP, COL.steelDk, 0, 12, 0.5);
  bead(c, 540, ty - 30, 110, 58);
  // paper slab with a flat wet patch
  shape(c, () => rrect(c, 760, ty - 12, 290, 12, 3), WHITE, 6);
  shape(c, () => ell(c, 905, ty - 13, 112, 7), COL.waterDk, 4);
  // the dropper squeezed by a hand, a drop falling onto the leaf
  shape(c, () => ell(c, 200, 215, 38, 62), COL.purple, 5);
  shape(c, () => rrect(c, 185, 270, 30, 230, 12), COL.glass, 5);
  shape(c, () => rrect(c, 190, 390, 20, 110, 8), COL.water, 0);
  shape(c, () => polyP(c, [[186, 495], [214, 495], [207, 555], [193, 555]]), COL.glass, 5);
  shape(c, () => { c.moveTo(200, 575); c.quadraticCurveTo(222, 612, 200, 622); c.quadraticCurveTo(178, 612, 200, 575); }, COL.water, 5);
  hand(c, 200, 130, Math.PI / 2, 1.6);
  arrow(c, [[300, 540], [300, 640]]);
};

// setup.e1.2
const e1_2 = (c: Ctx) => {
  ground(c, TABLE);
  c.save(); c.translate(540, 470); c.rotate(0.2);
  // the book the leaf is tilted on: a soft shadow, the cover, the page edge below
  shape(c, () => rrect(c, -330, -210, 740, 500, 14), SH, 0);
  shape(c, () => rrect(c, -396, -270, 740, 500, 14), COL.orange, 6);
  shape(c, () => rrect(c, -380, -240, 740, 500, 14), COL.teal, 6);
  shade(c, () => rrect(c, -380, -240, 740, 500, 14), COL.tealDk, 16, 16, 0.5);
  shape(c, () => rrect(c, -366, 252, 712, 54, 6), WHITE, 5);
  for (const k of [270, 286, 300]) line(c, [[-350, k], [330, k]], 2.5, COL.grey);
  // the chembu leaf with yellow haldi dust everywhere except the clean stripe the drop has left behind it
  // (dust is drawn in the heart's own frame: tip towards +y, the drop sits 55 along)
  const dust = (cc: Ctx) => {
    const r = rnd(5);
    for (let i = 0; i < 2600; i++) {
      const px = -150 + r() * 300, py = -130 + r() * 295;
      if (Math.abs(px) < 40 && py < 62) continue;
      cc.beginPath(); ell(cc, px, py, 2.4 + r() * 2.2, 2 + r() * 1.6); cc.fillStyle = r() < 0.6 ? "#f2c230" : "#d9a21c"; cc.fill();
    }
  };
  chembu(c, 10, 0, 1.8, 0, dust);
  // the drop, rolling on down its stripe
  ballDrop(c, 10 + 55 * 1.8, 80, 40);
  arrow(c, [[-50, 135], [150, 135]], "#d7372b", 12);
  c.restore();
};

// ---------------------------------------------------------------- e2: dough shapes and the bucket
// setup.e2.0
const e2_0 = (c: Ctx) => {
  ground(c, TABLE);
  plate(c, 540, 650, 470, 220);
  pancake(c, 250, 660, 1.05);
  ball(c, 540, 700, 92);
  cone(c, 840, 700, 330, 82);
};

// a blue bucket with water seen from the side: rim centre (cx, ry0), rim half width rw
const bucketFront = (c: Ctx, cx: number, ry0: number, rw: number, bottom: number, waterDrop: number) => {
  const body = () => { c.moveTo(cx - rw, ry0); c.lineTo(cx + rw, ry0); c.lineTo(cx + rw * 0.72, bottom); c.quadraticCurveTo(cx, bottom + 40, cx - rw * 0.72, bottom); c.closePath(); };
  shape(c, body, COL.blue, 6); shade(c, body, COL.blueDk, rw * 0.35, 0, 0.55);
  shape(c, () => ell(c, cx, ry0, rw, 52), COL.blueDk, 6);
  shape(c, () => ell(c, cx, ry0 + waterDrop, rw - 20, 40), COL.water, 0);
  shape(c, () => ell(c, cx - rw * 0.35, ry0 + waterDrop - 4, 50, 8), COL.drop, 0);
  c.beginPath(); ell(c, cx, ry0, rw, 52); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
};

// setup.e2.1
const e2_1 = (c: Ctx) => {
  ground(c, TABLE);
  news(c, [[120, 840], [980, 840], [1050, 1050], [30, 1050]]);
  const bx = 440, br = 650, brw = 210;
  shadow(c, bx + 50, 950, 250, 24);
  bucketFront(c, bx, br, brw, 940, 24);
  // the ruler standing in the water: its top is the 30 cm height
  const rx = 575, rb = 690, rt = 430;
  shape(c, () => rrect(c, rx - 24, rt, 48, rb - rt, 4), COL.wood, 5);
  for (let k = 0; k <= 30; k++) { const y = rb - ((rb - rt) * k) / 30, big = k % 10 === 0; line(c, [[rx - 24, y], [rx - (big ? 4 : 13), y]], big ? 4 : 2.5); }
  write(c, "30 cm", rx + 44, rt - 22, 46);
  c.setLineDash([14, 12]); line(c, [[bx + 30, rt], [rx - 26, rt]], 4, INK); c.setLineDash([]);
  // the dough beak held point down above the water
  cone(c, bx, 290, 140, 58, true);
  hand(c, bx, 170, Math.PI / 2, 1.8, SKIN.child, CLOTH.child);
  arrow(c, [[270, 300], [270, 450]]);
};

// setup.e2.2
const panelTop = (c: Ctx, x0: number, spots: number, seedN: number) => {
  const cx = x0 + 220, cy = 560;
  shadow(c, cx + 10, 770, 215, 22);
  news(c, [[x0, 340], [x0 + 440, 340], [x0 + 440, 780], [x0, 780]]);
  const r = rnd(seedN);
  let placed = 0, tries = 0;
  while (placed < spots && tries++ < 500) {
    const px = x0 + 30 + r() * 380, py = 370 + r() * 380, d = Math.hypot(px - cx, py - cy);
    if (d < 175) continue;
    const sz = 14 + r() * 12;
    shape(c, () => ell(c, px, py, sz, sz * 0.8, r() * 3), COL.waterDk, 4);
    shine(c, [[px - sz * 0.4, py - sz * 0.2], [px - sz * 0.1, py - sz * 0.45]], 4);
    placed++;
  }
  // the bucket from above
  shape(c, () => ell(c, cx, cy, 150, 150), COL.blue, 6);
  shape(c, () => ell(c, cx, cy, 124, 124), COL.water, 5);
  shade(c, () => ell(c, cx, cy, 124, 124), COL.waterDk, 18, 18, 0.5);
};
const e2_2 = (c: Ctx) => {
  ground(c, TABLE);
  panelTop(c, 40, 20, 3);
  panelTop(c, 600, 2, 8);
  pancake(c, 260, 270, 0.9);
  cone(c, 820, 150, 120, 52, true);
  line(c, [[540, 300], [540, 800]], 5, COL.greyDk);
};

// ---------------------------------------------------------------- e3: cup houses
// a paper cup, bottom centre (x, yb): kind 0 bare, 1 newspaper wall, 2 wet cloth wall
const cup = (c: Ctx, x: number, yb: number, w: number, h: number, kind: number) => {
  const tw = w / 2, bw = w * 0.36, yt = yb - h, ry = w * 0.085;
  shadow(c, x + w * 0.2, yb + 6, w * 0.7, w * 0.12);
  const body = () => polyP(c, [[x - tw, yt], [x + tw, yt], [x + bw, yb], [x - bw, yb]]);
  shape(c, body, WHITE, 6); shade(c, body, COL.grey, w * 0.2, 0, 0.5);
  if (kind === 0) {
    const band = () => polyP(c, [[x - tw + 4, yt + h * 0.14], [x + tw - 4, yt + h * 0.14], [x + tw - 4 - (tw - bw) * 0.3, yt + h * 0.38], [x - tw + 4 + (tw - bw) * 0.3, yt + h * 0.38]]);
    shape(c, band, COL.teal, 5); shade(c, band, COL.tealDk, w * 0.2, 0, 0.5);
  }
  if (kind === 1) {
    const sl = () => polyP(c, [[x - tw - 14, yt + h * 0.1], [x + tw + 14, yt + h * 0.1], [x + bw + 22, yb - h * 0.02], [x - bw - 22, yb - h * 0.02]]);
    shape(c, sl, NEWS, 6); shade(c, sl, COL.grey, w * 0.22, 0, 0.5);
    for (let k = 0; k < 6; k++) { const y = yt + h * (0.2 + k * 0.12); line(c, [[x - tw + 4, y], [x + tw - 4 - (k % 2) * 30, y]], 4, COL.greyDk); }
    // layers at the top edge
    line(c, [[x - tw - 14, yt + h * 0.1 + 14], [x + tw + 14, yt + h * 0.1 + 14]], 3, COL.greyDk);
    // rubber band
    const yb1 = yt + h * 0.5;
    shape(c, () => polyP(c, [[x - tw + 4, yb1 - 12], [x + tw - 4, yb1 - 12], [x + tw - 12, yb1 + 12], [x - tw + 12, yb1 + 12]]), COL.yellow, 5);
  }
  if (kind === 2) {
    const sl = () => { c.moveTo(x - tw - 12, yt + h * 0.1); c.lineTo(x + tw + 12, yt + h * 0.1); c.lineTo(x + bw + 20, yb - h * 0.02); c.quadraticCurveTo(x, yb + 18, x - bw - 20, yb - h * 0.02); c.closePath(); };
    shape(c, sl, "#a9c8e6", 6); shade(c, sl, "#7ea6c9", w * 0.22, 0, 0.6);
    for (const [fx, fy] of [[-0.25, 0.3], [0.2, 0.45], [-0.1, 0.65], [0.28, 0.75]]) shape(c, () => ell(c, x + fx * w, yt + h * fy, w * 0.09, w * 0.06), "#7ea6c9", 0);
    line(c, [[x - tw * 0.4, yt + h * 0.14], [x - bw * 0.5, yb - h * 0.1]], 3, "#7ea6c9");
    line(c, [[x + tw * 0.35, yt + h * 0.14], [x + bw * 0.45, yb - h * 0.1]], 3, "#7ea6c9");
    // drips
    shape(c, () => { c.moveTo(x - bw * 0.3 - 9, yb + 6); c.quadraticCurveTo(x - bw * 0.3, yb - 6, x - bw * 0.3 + 9, yb + 6); c.quadraticCurveTo(x - bw * 0.3, yb + 28, x - bw * 0.3 - 9, yb + 6); }, COL.drop, 3);
    shape(c, () => ell(c, x + bw * 0.6, yb + 18, 7, 9), COL.drop, 3);
  }
  shape(c, () => ell(c, x, yt, tw, ry), "#e8e4da", 6);
  return { yt, ry, tw };
};
// a card lid (a flat brown disc) centred at (x, y), tilted by rot
const lid = (c: Ctx, x: number, y: number, rx: number, rot = 0) => {
  c.save(); c.translate(x, y); c.rotate(rot);
  shape(c, () => ell(c, 0, 12, rx, rx * 0.22), COL.woodDk, 5);
  shape(c, () => ell(c, 0, 0, rx, rx * 0.22), COL.wood, 5);
  shine(c, [[-rx * 0.5, -rx * 0.06], [-rx * 0.15, -rx * 0.12]], 5);
  c.restore();
};

// setup.e3.0
const e3_0 = (c: Ctx) => {
  ground(c, TABLE);
  plate(c, 540, 720, 490, 150);
  cup(c, 250, 760, 230, 300, 0);
  cup(c, 540, 780, 230, 300, 1);
  cup(c, 830, 760, 230, 300, 2);
};

// an ice cube, centre (x, y), side s
const ice = (c: Ctx, x: number, y: number, s: number) => {
  const top = () => polyP(c, [[x, y - s * 0.75], [x + s * 0.8, y - s * 0.38], [x, y], [x - s * 0.8, y - s * 0.38]]);
  const lf = () => polyP(c, [[x - s * 0.8, y - s * 0.38], [x, y], [x, y + s * 0.85], [x - s * 0.8, y + s * 0.45]]);
  const rt = () => polyP(c, [[x + s * 0.8, y - s * 0.38], [x, y], [x, y + s * 0.85], [x + s * 0.8, y + s * 0.45]]);
  shape(c, lf, "#cde8f7", 5); shape(c, rt, "#a9d3ee", 5); shape(c, top, "#eaf6fd", 5);
  shine(c, [[x - s * 0.55, y - s * 0.3], [x - s * 0.55, y + s * 0.2]], 6);
};

// setup.e3.1
const e3_1 = (c: Ctx) => {
  ground(c, COL.sky);
  // the sun with rays
  c.beginPath(); ell(c, 900, 130, 80, 80); c.fillStyle = COL.yellow; c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; line(c, [[900 + Math.cos(a) * 105, 130 + Math.sin(a) * 105], [900 + Math.cos(a) * 150, 130 + Math.sin(a) * 150]], 9, COL.orange); }
  // the terrace floor with tile lines
  c.fillStyle = "#e3b48b"; c.fillRect(0, 690, D, D - 690); line(c, [[0, 690], [D, 690]], 6);
  for (let x = -80; x < D + 200; x += 170) line(c, [[x + 60, 690], [x - 60, D]], 3, "#c18f66");
  line(c, [[0, 850], [D, 850]], 3, "#c18f66");
  const cx = [330, 610, 890], yb = 850, w = 210, h = 270;
  // an ice cube sits in the second and third cups, sunk below the front rim
  cup(c, cx[0], yb, w, h, 0);
  for (const k of [1, 2]) {
    const q = cup(c, cx[k], yb, w, h, k);
    c.save(); c.beginPath(); c.rect(0, 0, D, q.yt); c.ellipse(cx[k], q.yt, w / 2 - 6, q.ry, 0, 0, Math.PI); c.clip();
    ice(c, cx[k], q.yt - 14, 100);
    c.restore();
    c.beginPath(); c.ellipse(cx[k], q.yt, w / 2, q.ry, 0, 0, Math.PI); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  }
  // a hand drops an ice cube into the first, empty cup
  ice(c, cx[0] + 4, 345, 80);
  hand(c, cx[0], 190, Math.PI / 2, 1.7, SKIN.child, CLOTH.child);
  arrow(c, [[cx[0] + 140, 340], [cx[0] + 140, 480]]);
};

// a clock face, centre (x, y), radius r, minute hand at the 2 (ten minutes past)
const clock = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + 12, y + r + 8, r * 0.9, 16);
  shape(c, () => ell(c, x, y, r + 12, r + 12), COL.purple, 6);
  shape(c, () => ell(c, x, y, r, r), WHITE, 5);
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2 - Math.PI / 2, big = k % 3 === 0; line(c, [[x + Math.cos(a) * r * (big ? 0.72 : 0.82), y + Math.sin(a) * r * (big ? 0.72 : 0.82)], [x + Math.cos(a) * r * 0.92, y + Math.sin(a) * r * 0.92]], big ? 7 : 4); }
  const mh = -Math.PI / 6;
  line(c, [[x, y], [x + Math.cos(mh) * r * 0.7, y + Math.sin(mh) * r * 0.7]], 8);
  line(c, [[x, y], [x + Math.cos(Math.PI * 0.9) * r * 0.45, y + Math.sin(Math.PI * 0.9) * r * 0.45]], 11);
  shape(c, () => ell(c, x, y, 9, 9), INK, 0);
  c.beginPath(); c.arc(x, y, r * 0.6, -Math.PI / 2, mh); c.strokeStyle = "#d7372b"; c.lineWidth = 9; c.lineCap = "round"; c.stroke();
};

// setup.e3.2
const e3_2 = (c: Ctx) => {
  const fy = 860;
  ground(c, "#cfc8dc");
  // sunny side on the right
  c.fillStyle = "#fbe7a8"; c.beginPath(); c.moveTo(640, 0); c.lineTo(D, 0); c.lineTo(D, D); c.lineTo(600, D); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(640, 0); c.lineTo(600, D); c.strokeStyle = INK; c.lineWidth = 5; c.stroke();
  c.beginPath(); ell(c, 880, 160, 70, 70); c.fillStyle = COL.yellow; c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; line(c, [[880 + Math.cos(a) * 92, 160 + Math.sin(a) * 92], [880 + Math.cos(a) * 130, 160 + Math.sin(a) * 130]], 8, COL.orange); }
  // floor
  c.fillStyle = "#c9a883"; c.fillRect(0, fy, 600, D - fy); c.fillStyle = "#e3b48b"; c.fillRect(600, fy, 480, D - fy); line(c, [[0, fy], [D, fy]], 6);
  // awning making the shade
  for (let k = 0; k < 6; k++) { c.fillStyle = k % 2 ? WHITE : COL.teal; c.beginPath(); c.moveTo(k * 108, 0); c.lineTo(k * 108 + 108, 0); c.lineTo(k * 108 + 108, 70); c.arc(k * 108 + 54, 70, 54, 0, Math.PI); c.closePath(); c.fill(); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); }
  clock(c, 330, 270, 105);
  // stool, table, and the child writing
  shape(c, () => rrect(c, 100, 836, 160, 22, 6), COL.brown, 5);
  for (const lx of [112, 232]) shape(c, () => rrect(c, lx, 856, 18, 28, 3), COL.brown, 5);
  for (const lx of [350, 590]) shape(c, () => rrect(c, lx, 760, 26, 100, 4), COL.brown, 5);
  shape(c, () => rrect(c, 320, 735, 330, 28, 6), COL.wood, 6);
  person(c, 170, fy, 560, { sit: true, armR: [0.9, -0.1], armL: [1.1, 0.0] });
  // notebook with the times written, and the pencil
  shape(c, () => polyP(c, [[400, 733], [590, 733], [625, 690], [435, 690]]), WHITE, 5);
  write(c, "10", 450, 696, 24, INK, 4); write(c, "20", 520, 696, 24, INK, 4);
  line(c, [[365, 700], [440, 728]], 14, INK); line(c, [[365, 700], [440, 728]], 7, COL.yellow);
  // cups in the sun
  const xs = [700, 840, 980];
  for (let k = 0; k < 3; k++) { cup(c, xs[k], fy, 130, 190, k); lid(c, xs[k], fy - 190, 72, 0); }
};

export const su_makingThingsBiomimicry = cards("sci.making-things.biomimicry.L3 set-up", [e1_0, e1_1, e1_2, e2_0, e2_1, e2_2, e3_0, e3_1, e3_2]);
