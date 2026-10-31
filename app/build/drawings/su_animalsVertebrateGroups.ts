import type { Ctx } from "./core";
import { CLOTH, COL, INK, RED, SKIN, WHITE, arrow, cards, ell, ground, hand, line, plate, polyP, rrect, shade, shadow, shape, shine, SH, write } from "./flatKit";

// sci.animals.vertebrate-groups.L3 set-up cards: sock-wrapped bottles cooling, tumblers in sun and shade, sabja-seed "frog eggs".
const WALL = "#f6efe0", WARM = "#ffe9a8";
const WOOL = "#f0d9a6", WOOLDK = "#d9bd82", WETW = "#8fa6c4", WETWDK = "#6b86a8";

const table = (c: Ctx, y: number, col: string = COL.wood, dk: string = COL.woodDk) => {
  c.fillStyle = col; c.fillRect(0, y, 1080, 1080 - y);
  c.fillStyle = dk; c.fillRect(0, y, 1080, 14);
  line(c, [[0, y], [1080, y]], 6);
};
// a forearm in a sleeve running from the wrist (x, y) backwards (opposite to angle an) off the card
const forearm = (c: Ctx, x: number, y: number, an: number, s: number) => {
  c.save(); c.translate(x, y); c.rotate(an); c.scale(s, s);
  shape(c, () => rrect(c, -700, -37, 640, 74, 14), CLOTH.child, 6);
  c.restore();
};
const hand2 = (c: Ctx, x: number, y: number, an: number, s: number, open = false) => { forearm(c, x, y, an, s); hand(c, x, y, an, s, SKIN.child, CLOTH.child, open); };

// a plastic bottle standing at (x, y) bottom centre; warm water; sock: none / dry / wet; lid: on or off
const bottle = (c: Ctx, x: number, y: number, w: number, h: number, sock: "none" | "dry" | "wet", lid = true) => {
  const body = () => rrect(c, x - w / 2, y - h, w, h, w * 0.22);
  shadow(c, x + w * 0.1, y + 6, w * 0.65, w * 0.12);
  shape(c, () => rrect(c, x - w * 0.18, y - h - w * 0.32, w * 0.36, w * 0.4, 6), COL.glass, 5);
  shape(c, body, COL.glass, 5);
  c.save(); c.beginPath(); body(); c.clip();
  const wy = y - h * 0.9; c.fillStyle = COL.water; c.fillRect(x - w, wy, w * 2, h);
  c.fillStyle = COL.waterDk; c.globalAlpha = 0.5; c.fillRect(x + w * 0.2, wy, w, h); c.globalAlpha = 1; c.restore();
  line(c, [[x - w / 2 + 6, wy], [x + w / 2 - 6, wy]], 4, COL.drop);
  shape(c, body, "rgba(0,0,0,0)", 5);
  if (sock !== "none") {
    const top = y - h * 0.72, wet = sock === "wet", f = wet ? WETW : WOOL, dk = wet ? WETWDK : WOOLDK;
    const sk = () => rrect(c, x - w / 2 - 7, top, w + 14, y - top + 4, 20);
    shape(c, sk, f, 5); shade(c, sk, dk, w * 0.16, 0, 0.6);
    for (let i = 1; i < 6; i++) line(c, [[x - w / 2 - 7 + (i * (w + 14)) / 6, top + 40], [x - w / 2 - 7 + (i * (w + 14)) / 6, y - 12]], 3, dk);
    shape(c, () => rrect(c, x - w / 2 - 7, top, w + 14, h * 0.12, 8), wet ? COL.blueDk : COL.red, 5);
    if (wet) for (const [dx, dy, r] of [[-0.3, 0.1, 0.05], [0.05, 0.3, 0.06], [0.32, 0.05, 0.045], [-0.1, 0.5, 0.05], [0.28, 0.45, 0.05]]) shape(c, () => ell(c, x + dx * w, top + h * 0.2 + dy * h * 0.5, r * w * 0.6, r * w * 0.8), COL.drop, 3);
    if (wet) for (const dx of [-0.25, 0.22]) shape(c, () => ell(c, x + dx * w, y + 20, w * 0.045, w * 0.06), COL.drop, 3);
  }
  shine(c, [[x - w * 0.36, y - h * 0.97], [x - w * 0.36, y - h * 0.75]], 7);
  if (lid) shape(c, () => rrect(c, x - w * 0.23, y - h - w * 0.5, w * 0.46, w * 0.2, 6), COL.red, 5);
};
// a glass thermometer: bulb centre at (x, y), pointing towards angle an, length len, red column to level 0..1
const thermo = (c: Ctx, x: number, y: number, len: number, an: number, level: number) => {
  c.save(); c.translate(x, y); c.rotate(an);
  shape(c, () => rrect(c, 0, -13, len, 26, 13), WHITE, 5);
  for (let i = 1; i < 9; i++) line(c, [[len * 0.12 + (i * len * 0.8) / 9, -13], [len * 0.12 + (i * len * 0.8) / 9, i % 2 ? -5 : 0]], 3);
  line(c, [[0, 0], [len * level, 0]], 9, RED);
  shape(c, () => ell(c, 0, 0, 22, 22), RED, 5);
  c.restore();
};
const clock = (c: Ctx, x: number, y: number, r: number, min: number) => {
  shape(c, () => ell(c, x, y, r, r), WHITE, 7);
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[x + Math.sin(a) * r * 0.8, y - Math.cos(a) * r * 0.8], [x + Math.sin(a) * r * 0.9, y - Math.cos(a) * r * 0.9]], 5); }
  const m = (min / 60) * Math.PI * 2, hr = (min / 60) * Math.PI / 6 + Math.PI * 0.9;
  line(c, [[x, y], [x + Math.sin(hr) * r * 0.5, y - Math.cos(hr) * r * 0.5]], 9);
  line(c, [[x, y], [x + Math.sin(m) * r * 0.76, y - Math.cos(m) * r * 0.76]], 6);
  shape(c, () => ell(c, x, y, 8, 8), INK, 0);
};
// a steel tumbler (x, y bottom centre) with water showing in the open top
const tumbler = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w * 0.12, y + 8, w * 0.6, w * 0.1);
  const bw = w * 0.4, body = () => { c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + bw, y); c.quadraticCurveTo(x, y + w * 0.08, x - bw, y); c.closePath(); };
  shape(c, body, COL.steel, 6); shade(c, body, COL.steelDk, w * 0.3, 0, 0.7);
  shape(c, () => ell(c, x, y - h, w / 2, w * 0.1), COL.steelIn, 6);
  shape(c, () => ell(c, x, y - h + 2, w / 2 - 12, w * 0.075), COL.water, 0);
  shine(c, [[x - w * 0.36, y - h * 0.82], [x - w * 0.3, y - h * 0.2]], 8);
};
const sun = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; line(c, [[x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25], [x + Math.cos(a) * r * 1.65, y + Math.sin(a) * r * 1.65]], 9, COL.orange); }
  shape(c, () => ell(c, x, y, r, r), COL.yellow, 6);
};
const steam = (c: Ctx, x: number, y: number) => { for (const dx of [-26, 0, 26]) line(c, [[x + dx, y], [x + dx - 14, y - 30], [x + dx + 12, y - 60], [x + dx - 6, y - 90]], 6, "#ffffff"); };
// a jelly ball of a soaked sabja seed: clear jelly round a tiny black seed
const jelly = (c: Ctx, x: number, y: number, r: number) => {
  shape(c, () => ell(c, x, y, r, r), "rgba(218,240,250,0.92)", Math.max(3, r * 0.1));
  shade(c, () => ell(c, x, y, r, r), COL.glassEdge, r * 0.3, r * 0.3, 0.35);
  shape(c, () => ell(c, x + r * 0.03, y + r * 0.04, r * 0.34, r * 0.28), "#2a2630", 0);
  line(c, [[x - r * 0.6, y - r * 0.2], [x - r * 0.4, y - r * 0.55]], Math.max(3, r * 0.1), WHITE);
};

// setup.e1.0
const e1s0 = (c: Ctx) => {
  ground(c, WALL); table(c, 640);
  bottle(c, 230, 830, 210, 340, "none"); bottle(c, 540, 830, 210, 340, "dry"); bottle(c, 850, 830, 210, 340, "wet");
  thermo(c, 330, 960, 420, -0.05, 0.4);
};
// setup.e1.1
const e1s1 = (c: Ctx) => {
  ground(c, WALL); table(c, 780);
  clock(c, 850, 190, 120, 5);
  bottle(c, 400, 900, 300, 460, "none", false);
  shape(c, () => rrect(c, 650, 855, 130, 54, 10), COL.red, 5);
  thermo(c, 400, 720, 600, -Math.PI / 2, 0.45);
  hand2(c, 590, 340, Math.PI, 1.6);
};
// setup.e1.2
const e1s2 = (c: Ctx) => {
  ground(c, COL.wood);
  shape(c, () => polyP(c, [[85, 150 + 20], [835 + 20, 150 + 20], [835 + 20, 710 + 20], [85, 710 + 20]]), SH, 0);
  shape(c, () => rrect(c, 70, 130, 770, 580, 10), COL.paper, 6);
  for (const x of [300, 470, 640]) line(c, [[x, 130], [x, 710]], 5);
  for (const y of [310, 500]) line(c, [[70, y], [840, y]], 5);
  const rows = [["none", "31", "27", "24"], ["dry", "35", "33", "31"], ["wet", "29", "", ""]];
  rows.forEach(([k, ...v], i) => {
    const cy = 220 + i * 190;
    bottle(c, 185, cy + 85, 78, 130, k as "none" | "dry" | "wet", true);
    v.forEach((t, j) => { if (t) write(c, t, 330 + j * 170, cy - 40, 80, INK, 8); });
  });
  line(c, [[445, 650], [445 + 0.87 * 260, 650 - 0.5 * 260]], 26, INK);
  line(c, [[445, 650], [445 + 0.87 * 260, 650 - 0.5 * 260]], 14, COL.yellow);
  shape(c, () => polyP(c, [[445, 650], [445 + 0.87 * 40 - 8, 650 - 0.5 * 40 - 12], [445 + 0.87 * 40 + 10, 650 - 0.5 * 40 + 6]]), COL.wood, 4);
  hand2(c, 654 + 6, 568, Math.PI, 1.5);
};
// setup.e2.0
const e2s0 = (c: Ctx) => {
  ground(c, "#c9d2e3"); c.fillStyle = WARM; c.fillRect(0, 0, 540, 1080);
  table(c, 640, "#a58a62", "#8c7250"); c.fillStyle = "#f4c96a"; c.fillRect(0, 654, 540, 426); line(c, [[0, 640], [540, 640]], 6);
  c.fillStyle = COL.woodDk; c.fillRect(0, 640, 540, 14); line(c, [[0, 640], [540, 640]], 6);
  line(c, [[540, 0], [540, 1080]], 5);
  sun(c, 270, 200, 85);
  tumbler(c, 270, 860, 260, 320); tumbler(c, 810, 860, 260, 320);
  thermo(c, 410, 960, 260, 0, 0.4);
};
// setup.e2.1
const e2s1 = (c: Ctx) => {
  ground(c, WARM); table(c, 800, "#f4c96a", COL.woodDk);
  sun(c, 140, 140, 70);
  clock(c, 880, 190, 120, 15);
  tumbler(c, 400, 930, 340, 400);
  c.save(); c.beginPath(); c.rect(0, 0, 1080, 540); c.clip(); thermo(c, 400, 760, 640, -Math.PI / 2, 0.45); c.restore();
  hand2(c, 595, 330, Math.PI, 1.6);
};
// setup.e2.2
const e2s2 = (c: Ctx) => {
  ground(c, COL.sky); sun(c, 300, 170, 95);
  c.fillStyle = "#d9a07a"; c.fillRect(0, 700, 1080, 380);
  for (let r = 0; r < 4; r++) { const y = 700 + r * 95; line(c, [[0, y], [1080, y]], 4, "#a8704c"); for (let k = 0; k < 6; k++) line(c, [[(r % 2 ? 90 : 0) + k * 190, y], [(r % 2 ? 90 : 0) + k * 190, y + 95]], 4, "#a8704c"); }
  shape(c, () => rrect(c, -20, 640, 1120, 66, 8), "#ecc9a3", 6);
  // lizard on the ledge, head to the right
  shadow(c, 400, 666, 280, 14);
  const G = "#b5c46a", GD = "#8b9c46";
  line(c, [[220, 600], [130, 625], [70, 600], [40, 560]], 34, INK); line(c, [[220, 600], [130, 625], [70, 600], [40, 560]], 20, G);
  for (const lx of [290, 520]) { line(c, [[lx, 610], [lx - 30, 650], [lx + 5, 664]], 30, INK); line(c, [[lx, 610], [lx - 30, 650], [lx + 5, 664]], 18, G); }
  const bd = () => ell(c, 400, 590, 200, 54); shape(c, bd, G); shade(c, bd, GD, 20, 26, 0.7);
  for (const [x, y] of [[330, 575], [400, 570], [470, 578], [370, 600], [440, 605]]) shape(c, () => ell(c, x, y, 12, 9), GD, 0);
  const hd = () => { c.moveTo(560, 550); c.quadraticCurveTo(650, 540, 700, 585); c.quadraticCurveTo(650, 625, 560, 630); c.closePath(); }; shape(c, hd, G);
  shape(c, () => ell(c, 625, 570, 15, 15), WHITE, 4); shape(c, () => ell(c, 628, 571, 6, 8), INK, 0);
  for (const lx of [330, 560]) { line(c, [[lx, 610], [lx + 30, 650], [lx + 70, 664]], 30, INK); line(c, [[lx, 610], [lx + 30, 650], [lx + 70, 664]], 18, G); }
  tumbler(c, 880, 668, 200, 250);
  steam(c, 880, 410);
  c.save(); c.beginPath(); c.rect(0, 0, 1080, 450); c.clip(); thermo(c, 884, 560, 360, -Math.PI / 2, 0.8); c.restore();
};
// setup.e3.0
const e3s0 = (c: Ctx) => {
  ground(c, WALL); table(c, 40, "#f2e6cc", "#f2e6cc");
  c.fillStyle = "#f2e6cc"; c.fillRect(0, 0, 1080, 1080);
  const d = [0.6, 0.8], an = Math.atan2(-d[1], -d[0]), B = [370, 340];
  const hx = B[0] + 640 * d[0], hy = B[1] + 640 * d[1];
  c.save(); c.translate(B[0], B[1]); c.rotate(Math.atan2(d[1], d[0]));
  shadow(c, 30, 40, 250, 130);
  shape(c, () => rrect(c, 200, -16, 470, 32, 16), COL.steel, 6);
  shape(c, () => ell(c, 0, 0, 230, 160), COL.steel, 6);
  shape(c, () => ell(c, 0, 0, 196, 130), COL.steelIn, 4);
  for (let r = -2; r <= 2; r++) for (let k = -3; k <= 3; k++) { const u = k * 58 + (r % 2 ? 29 : 0), v = r * 50; if ((u / 165) ** 2 + (v / 105) ** 2 < 1) { c.save(); c.rotate(-Math.atan2(d[1], d[0])); const ca = Math.cos(Math.atan2(d[1], d[0])), sa = Math.sin(Math.atan2(d[1], d[0])); jelly(c, u * ca - v * sa, u * sa + v * ca, 30); c.restore(); } }
  c.restore();
  hand2(c, hx, hy, an, 1.5);
};
// setup.e3.1
const e3s1 = (c: Ctx) => {
  ground(c, WALL); table(c, 250, "#f2e6cc", "#f2e6cc"); c.fillStyle = "#f2e6cc"; c.fillRect(0, 0, 1080, 1080);
  const R = 150, Y = 560, bw = (x: number, inside: string) => {
    shadow(c, x + 20, Y + R * 0.78, R * 0.95, 26);
    const b = () => { c.moveTo(x - R, Y); c.bezierCurveTo(x - R * 0.9, Y + R * 0.95, x + R * 0.9, Y + R * 0.95, x + R, Y); c.closePath(); };
    shape(c, b, COL.steel); shade(c, b, COL.steelDk, R * 0.35, -R * 0.05);
    shape(c, () => ell(c, x, Y, R, R * 0.38), inside, 6);
  };
  const X = [180, 540, 900];
  bw(X[0], COL.steelIn); bw(X[1], COL.waterDk); bw(X[2], COL.steelIn);
  // 1: open air
  for (const [dx, dy] of [[-70, 10], [0, 20], [70, 10], [-35, -30], [35, -30], [0, -75]]) jelly(c, X[0] + dx, Y + dy - 10, 34);
  // 2: under water
  c.save(); c.beginPath(); ell(c, X[1], Y, R - 4, R * 0.38 - 3); c.clip();
  c.fillStyle = COL.water; c.fillRect(X[1] - R, Y - 80, 2 * R, 160);
  for (const [dx, dy] of [[-80, 5], [-30, 22], [30, 12], [85, 0], [-50, -22], [10, -26], [65, -20]]) jelly(c, X[1] + dx, Y + dy, 30);
  c.globalAlpha = 0.4; c.fillStyle = COL.water; c.fillRect(X[1] - R, Y - 80, 2 * R, 160); c.globalAlpha = 1; c.restore();
  line(c, [[X[1] - 100, Y - 20], [X[1] - 70, Y - 28], [X[1] - 40, Y - 20]], 5, COL.drop); line(c, [[X[1] + 40, Y + 30], [X[1] + 70, Y + 22], [X[1] + 100, Y + 30]], 5, COL.drop);
  // 3: inside a taped egg shell
  const egg = () => { c.moveTo(X[2], Y - 270); c.bezierCurveTo(X[2] + 120, Y - 270, X[2] + 110, Y + 10, X[2], Y + 10); c.bezierCurveTo(X[2] - 110, Y + 10, X[2] - 120, Y - 270, X[2], Y - 270); c.closePath(); };
  shape(c, egg, COL.cloth); shade(c, egg, COL.grey, 40, 0, 0.55);
  line(c, [[X[2] - 106, Y - 140], [X[2] - 60, Y - 160], [X[2] - 20, Y - 125], [X[2] + 30, Y - 160], [X[2] + 70, Y - 128], [X[2] + 108, Y - 150]], 5);
  shape(c, () => polyP(c, [[X[2] - 118, Y - 175], [X[2] + 118, Y - 175], [X[2] + 118, Y - 105], [X[2] - 118, Y - 105]]), "#f3e3b5", 5);
  shine(c, [[X[2] - 70, Y - 235], [X[2] - 90, Y - 190]], 8);
  shape(c, () => ell(c, X[2], Y, R, R * 0.38), "rgba(0,0,0,0)", 0);
  c.save(); c.beginPath(); c.rect(0, Y, 1080, 400); c.clip(); const b3 = () => { c.moveTo(X[2] - R, Y); c.bezierCurveTo(X[2] - R * 0.9, Y + R * 0.95, X[2] + R * 0.9, Y + R * 0.95, X[2] + R, Y); c.closePath(); }; shape(c, b3, COL.steel); shade(c, b3, COL.steelDk, R * 0.35, -R * 0.05); c.restore();
  c.save(); c.beginPath(); c.rect(0, Y + 1, 1080, 400); c.clip(); c.beginPath(); ell(c, X[2], Y, R, R * 0.38); c.strokeStyle = INK; c.lineWidth = 6; c.stroke(); c.restore();
};
// setup.e3.2
const e3s2 = (c: Ctx) => {
  ground(c, WALL); c.fillStyle = COL.wood; c.fillRect(0, 0, 1080, 1080);
  plate(c, 560, 640, 480, 290);
  const dry = (x: number, y: number, s: number) => {
    const bl = () => { c.moveTo(x - 110 * s, y + 20 * s); c.quadraticCurveTo(x - 130 * s, y - 50 * s, x - 60 * s, y - 70 * s); c.quadraticCurveTo(x, y - 95 * s, x + 70 * s, y - 60 * s); c.quadraticCurveTo(x + 130 * s, y - 20 * s, x + 105 * s, y + 25 * s); c.quadraticCurveTo(x, y + 60 * s, x - 110 * s, y + 20 * s); c.closePath(); };
    shape(c, bl, "#b79f78", 5 * s); shade(c, bl, "#8d7650", 30 * s, 30 * s, 0.7);
    line(c, [[x - 70 * s, y - 20 * s], [x - 20 * s, y - 5 * s], [x + 10 * s, y - 40 * s], [x + 60 * s, y - 20 * s]], 4 * s, "#6a5738");
    line(c, [[x - 10 * s, y + 20 * s], [x + 20 * s, y + 0], [x + 80 * s, y + 10 * s]], 4 * s, "#6a5738");
    for (const [dx, dy] of [[-40, -45], [30, -55], [-80, 0], [60, 20], [-20, 30]]) shape(c, () => ell(c, x + dx * s, y + dy * s, 9 * s, 6 * s), "#2a2630", 0);
  };
  const L = [430, 480], r = 185;
  dry(L[0], L[1] + 40, 1.0);
  for (const [dx, dy] of [[0, 0], [66, -12], [-60, -10], [30, -62], [-30, -62], [100, 40], [-90, 40], [10, 52], [60, 50], [-45, 55]]) jelly(c, 790 + dx * 1.3, 640 + dy * 1.3, 44);
  // hand and handle
  const dir = [0.6, -0.8], W = [L[0] - dir[0] * 700, L[1] - dir[1] * 700];
  line(c, [[L[0] - dir[0] * (r + 8), L[1] - dir[1] * (r + 8)], [L[0] - dir[0] * 560, L[1] - dir[1] * 560]], 34, INK);
  line(c, [[L[0] - dir[0] * (r + 8), L[1] - dir[1] * (r + 8)], [L[0] - dir[0] * 560, L[1] - dir[1] * 560]], 20, COL.brown);
  // lens
  shape(c, () => ell(c, L[0], L[1], r, r), "rgba(235,246,252,0.95)", 0);
  c.save(); c.beginPath(); ell(c, L[0], L[1], r - 4, r - 4); c.clip(); c.fillStyle = "#e8d7b0"; c.fillRect(0, 0, 1080, 1080);
  dry(L[0], L[1] + 50, 2.0); c.restore();
  shape(c, () => ell(c, L[0], L[1], r, r), "rgba(0,0,0,0)", 12);
  shine(c, [[L[0] - r * 0.7, L[1] - r * 0.3], [L[0] - r * 0.45, L[1] - r * 0.7]], 10);
  void W;
  hand2(c, L[0] - dir[0] * 505, L[1] - dir[1] * 505, Math.atan2(dir[1], dir[0]), 1.4);
};

export const su_animalsVertebrateGroups = cards("sci.animals.vertebrate-groups.L3 set-up", [e1s0, e1s1, e1s2, e2s0, e2s1, e2s2, e3s0, e3s1, e3s2]);
