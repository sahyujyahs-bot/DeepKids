import type { Ctx } from "./core";
import { D, INK, WHITE, RED, COL, SKIN, CLOTH, ground, shape, ell, polyP, rrect, shadow, shade, line, shine, arrow, hand, person, write, cards } from "./flatKit";

// sci.light.what-is-light.L3 · set-up cards. Same helper (blue shirt) and child (orange shirt) on every playground card.
const NIGHT = "#1b1d3a", CLOTHN = "#2d3466", CLOTHN2 = "#232955", STARDIM = "#b9c58a", STARDIMDK = "#8c9a62";

// a person's wrist for the given arm angles (same arithmetic as person())
const wrist = (x: number, y: number, h: number, side: number, [a1, a2]: [number, number]) => {
  const sx = x + side * h * 0.11, sy = y - h * 0.74 + h * 0.03, ex = sx + Math.cos(a1) * h * 0.17, ey = sy + Math.sin(a1) * h * 0.17;
  return [ex + Math.cos(a2) * h * 0.16, ey + Math.sin(a2) * h * 0.16];
};
// a steel plate held on edge (seen from the side), centre (x, y)
const plateEdge = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  shape(c, () => ell(c, x, y, rx, ry), COL.steel);
  shade(c, () => ell(c, x, y, rx, ry), COL.steelDk, rx * 0.5, 0);
  shape(c, () => ell(c, x, y, rx * 0.55, ry * 0.8), COL.steelIn, 4);
};
const grass = (c: Ctx, y: number) => { c.fillStyle = COL.greenLt; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };
const feet = (c: Ctx, x0: number, x1: number, y: number, n: number) => {
  for (let i = 0; i < n; i++) { const x = x0 + ((x1 - x0) * i) / (n - 1), up = i % 2 ? -12 : 12; shape(c, () => ell(c, x, y + up, 17, 10), COL.soil, 4); }
};
const star = (c: Ctx, x: number, y: number, r: number, fill: string, dk: string, line_ = 6) => {
  const pts: number[][] = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
  shape(c, () => polyP(c, pts), fill, line_); shade(c, () => polyP(c, pts), dk, r * 0.12, r * 0.12, 0.5); c.beginPath(); polyP(c, pts); c.lineWidth = line_; c.strokeStyle = INK; c.lineJoin = "round"; c.stroke();
};
const glowStar = (c: Ctx, x: number, y: number, r: number) => {
  for (let i = 5; i >= 1; i--) { c.beginPath(); ell(c, x, y, r * (1 + i * 0.2), r * (1 + i * 0.2)); c.fillStyle = "rgba(170,255,190,0.12)"; c.fill(); }
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6 + 0.26; line(c, [[x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25], [x + Math.cos(a) * r * 1.6, y + Math.sin(a) * r * 1.6]], 9, "#d9ffd0"); }
  star(c, x, y, r, "#f2ffd8", "#bfe8a0");
};
// a dark cloth on a table: the top surface of the night cards
const nightTable = (c: Ctx, y: number) => { ground(c, NIGHT); shape(c, () => polyP(c, [[0, y], [D, y], [D, D], [0, D]]), CLOTHN, 0); line(c, [[0, y], [D, y]], 6); shade(c, () => polyP(c, [[0, y + 200], [D, y + 200], [D, D], [0, D]]), CLOTHN2, 0, 0, 0.6); };
// a forearm sleeve running to the card edge from a mirrored hand (hand points left)
const handLeft = (c: Ctx, wx: number, wy: number, s: number, skin: string, sleeve: string, open = false) => {
  shape(c, () => rrect(c, wx + 70 * s, wy - 36 * s, D - wx, 72 * s, 14), sleeve, 6);
  c.save(); c.translate(wx, 0); c.scale(-1, 1); hand(c, 0, wy, 0, s, skin, sleeve, open); c.restore();
};

// setup.e1.0
const plateFace = (c: Ctx, x: number, y: number, r: number) => {
  shadow(c, x + r * 0.15, y + r * 1.05, r * 0.9, r * 0.12);
  shape(c, () => ell(c, x, y, r, r), COL.steel);
  shade(c, () => ell(c, x, y, r, r), COL.steelDk, r * 0.3, r * 0.3);
  shape(c, () => ell(c, x, y, r * 0.72, r * 0.72), COL.steelIn, 5);
  shine(c, [[x - r * 0.5, y - r * 0.3], [x - r * 0.3, y - r * 0.55]], 8);
};
const e1s0 = (c: Ctx) => {
  ground(c); grass(c, 930);
  shadow(c, 330, 940, 150, 22); shadow(c, 880, 940, 90, 16);
  const aL: [number, number] = [-1.9, -1.2], aR: [number, number] = [-1.25, -1.9], h = 640, x = 300, y = 930;
  person(c, 880, y, 470);
  const [lx, ly] = wrist(x, y, h, -1, aL), [rx, ry] = wrist(x, y, h, 1, aR);
  person(c, x, y, h, { adult: true, armL: aL, armR: aR });
  plateFace(c, lx - 55, ly - 140, 92); plateFace(c, rx + 55, ry - 140, 92);
  hand(c, lx, ly + 10, -Math.PI / 2 - 0.1, 0.8, SKIN.adult, CLOTH.adult); hand(c, rx, ry + 10, -Math.PI / 2 + 0.1, 0.8, SKIN.adult, CLOTH.adult);
  feet(c, 450, 740, 1005, 7); write(c, "20", 535, 835, 72, INK, 9);
  line(c, [[455, 905], [455, 925]], 5); line(c, [[745, 905], [745, 925]], 5); line(c, [[455, 915], [745, 915]], 5);
};

// setup.e1.1
const e1s1 = (c: Ctx) => {
  ground(c); grass(c, 900);
  shadow(c, 700, 910, 120, 20); shadow(c, 120, 906, 30, 6);
  // the helper, small and far away, plates held up
  person(c, 120, 900, 190, { adult: true, armL: [-1.75, -1.5], armR: [-1.39, -1.64] });
  plateEdge(c, 95, 735, 10, 30); plateEdge(c, 145, 735, 10, 30);
  // the child walking away: arms swinging, steps behind, arrow ahead
  person(c, 700, 900, 520);
  feet(c, 230, 620, 945, 8);
  write(c, "100", 300, 1015, 48, INK, 7); write(c, "200", 520, 1015, 48, INK, 7);
  arrow(c, [[820, 700], [1030, 700]], RED, 14);
};

// setup.e1.2
const e1s2 = (c: Ctx) => {
  ground(c); grass(c, 900);
  shadow(c, 210, 910, 130, 20); shadow(c, 900, 910, 90, 16);
  const h = 520, x = 210, y = 900, aL: [number, number] = [-1.7, -1.4], aR: [number, number] = [-1.44, -1.74];
  person(c, 900, y, 420);
  person(c, x, y, h, { adult: true, armL: aL, armR: aR });
  const [lx, ly] = wrist(x, y, h, -1, aL), [rx, ry] = wrist(x, y, h, 1, aR);
  plateEdge(c, lx + 22, ly - 70, 26, 88); plateEdge(c, rx - 4, ry - 70, 26, 88);
  const bx = x + 8, by = ly - 140, sp: number[][] = [];
  for (let i = 0; i < 16; i++) { const a = (i * Math.PI) / 8, rr = i % 2 ? 36 : 74; sp.push([bx + Math.cos(a) * rr, by + Math.sin(a) * rr]); }
  shape(c, () => polyP(c, sp), COL.yellow, 5);
  // light: straight and fast, all the way to the child's eyes
  const ex = 868, ey = 540;
  line(c, [[bx + 70, by + 20], [ex, ey]], 24, INK); line(c, [[bx + 70, by + 20], [ex, ey]], 14, COL.yellow);
  // sound: a curl that has only got part of the way
  const sx = bx + 60, sy = by + 80, ang = Math.atan2(ey - sy, ex - sx), pts: number[][] = [];
  for (let t = 0; t <= 250; t += 6) { const w = Math.sin(t / 14) * 22; pts.push([sx + Math.cos(ang) * t - Math.sin(ang) * w, sy + Math.sin(ang) * t + Math.cos(ang) * w]); }
  line(c, pts, 16, INK); line(c, pts, 8, COL.purple);
  const tip = pts[pts.length - 1]; shape(c, () => ell(c, tip[0], tip[1], 11, 11), COL.purple, 4);
};

// setup.e2.0
const e2s0 = (c: Ctx) => {
  ground(c, NIGHT);
  // an open box seen from above: three stars lying on the cloth inside, the lid held over it
  shape(c, () => rrect(c, 120, 640, 840, 240, 20), COL.wood); shade(c, () => rrect(c, 120, 640, 840, 240, 20), COL.woodDk, 22, 0, 0.5);
  shape(c, () => polyP(c, [[120, 640], [960, 640], [890, 370], [190, 370]]), CLOTHN, 6);
  line(c, [[120, 640], [960, 640], [890, 370], [190, 370], [120, 640]], 7);
  [300, 540, 780].forEach((x) => { c.save(); c.translate(x, 530); c.scale(1, 0.62); star(c, 0, 0, 100, STARDIM, STARDIMDK); c.restore(); });
  // the lid
  shape(c, () => polyP(c, [[210, 110], [800, 110], [880, 190], [130, 190]]), COL.wood); shade(c, () => polyP(c, [[210, 110], [800, 110], [880, 190], [130, 190]]), COL.woodDk, 0, 26, 0.5);
  shape(c, () => rrect(c, 130, 190, 750, 36, 8), COL.woodDk);
  handLeft(c, 880, 150, 1.3, SKIN.child, CLOTH.child);
  arrow(c, [[500, 250], [500, 350]], RED, 14);
};

// setup.e2.1
const phoneOver = (c: Ctx, x: number, screen: string, glowRGB: string, num: string) => {
  nightTable(c, 720);
  [300, 700].forEach((s) => { shadow(c, s + 20, 890, 110, 20); star(c, s, 840, 85, STARDIM, STARDIMDK); });
  // the screen's light falls from under the phone onto the star below it
  c.beginPath(); polyP(c, [[x - 140, 575], [x + 140, 575], [x + 190, 880], [x - 190, 880]]); c.fillStyle = glowRGB; c.fill();
  c.beginPath(); ell(c, x, 850, 200, 50); c.fillStyle = glowRGB; c.fill();
  star(c, x, 840, 85, STARDIM, STARDIMDK);
  c.beginPath(); ell(c, x, 840, 85, 85); c.fillStyle = glowRGB; c.fill();
  // the phone held flat, back up: camera on top, the lit screen face underneath
  shape(c, () => rrect(c, x - 150, 520, 300, 70, 26), screen, 6);
  shape(c, () => rrect(c, x - 150, 440, 300, 130, 26), "#2f3040"); shade(c, () => rrect(c, x - 150, 440, 300, 130, 26), "#1a1b26", 14, 12, 0.6);
  shape(c, () => ell(c, x - 95, 485, 28, 28), "#1a1b26", 5); shape(c, () => ell(c, x - 95, 485, 12, 12), "#5b8fd6", 3);
  shape(c, () => rrect(c, x - 150, 440, 300, 130, 26), "rgba(0,0,0,0)", 6);
  handLeft(c, x + 150 + 70, 505, 1.3, SKIN.child, CLOTH.child);
  write(c, num, x - 20, 960, 80, WHITE, 10);
  write(c, num === "1" ? "2" : "1", (num === "1" ? 700 : 300) - 20, 960, 80, WHITE, 10);
};
const e2s1 = (c: Ctx) => { phoneOver(c, 300, "#ff3b30", "rgba(255,70,50,0.38)", "1"); };
// setup.e2.2
const e2s2 = (c: Ctx) => { phoneOver(c, 700, "#2f6bff", "rgba(70,110,255,0.35)", "2"); };
// setup.e2.3
const e2s3 = (c: Ctx) => {
  nightTable(c, 640);
  shadow(c, 300, 770, 120, 22); shadow(c, 780, 770, 120, 22);
  star(c, 280, 600, 150, STARDIM, STARDIMDK);
  glowStar(c, 760, 600, 150);
  write(c, "1", 260, 880, 110, WHITE, 12); write(c, "2", 740, 880, 110, WHITE, 12);
};

// the microwave body, shared by the three chocolate cards
const mwBody = (c: Ctx, x: number, y: number, w: number, h: number) => {
  shadow(c, x + w / 2 + 20, y + h + 10, w / 2 + 20, 24);
  shape(c, () => rrect(c, x, y, w, h, 28), "#d8dde6"); shade(c, () => rrect(c, x, y, w, h, 28), COL.steelDk, 18, 0, 0.35);
  shape(c, () => rrect(c, x, y, w, h, 28), "rgba(0,0,0,0)", 7);
};
// setup.e3.0
const e3s0 = (c: Ctx) => {
  ground(c);
  mwBody(c, 90, 520, 900, 440);
  shape(c, () => polyP(c, [[110, 548], [20, 505], [20, 975], [110, 930]]), "#5b6678", 6);
  shape(c, () => rrect(c, 150, 550, 580, 380, 14), "#2c3045", 6);
  // empty floor: roller ring and the little coupling in the middle
  shape(c, () => ell(c, 440, 850, 190, 38), "#3d4260", 5);
  shape(c, () => ell(c, 440, 850, 40, 10), COL.steelDk, 4);
  [250, 330, 550, 630].forEach((x) => shape(c, () => ell(c, x, 856, 11, 8), COL.steel, 3));
  // control panel
  shape(c, () => rrect(c, 770, 560, 190, 360, 14), "#bfc6d2", 6);
  shape(c, () => rrect(c, 795, 590, 140, 70, 8), "#22303a", 5);
  [0, 1, 2].forEach((i) => [0, 1, 2].forEach((j) => shape(c, () => rrect(c, 795 + i * 50, 700 + j * 60, 40, 40, 8), COL.steelIn, 4)));
  // the round glass plate lifted out, high above the oven
  shadow(c, 445, 440, 200, 30);
  shape(c, () => ell(c, 435, 320, 285, 70), "rgba(214,236,250,0.9)", 6);
  shape(c, () => ell(c, 435, 322, 235, 52), "rgba(255,255,255,0.45)", 4);
  shine(c, [[230, 285], [330, 262]], 8);
  handLeft(c, 860, 330, 1.5, SKIN.adult, CLOTH.adult);
  arrow(c, [[200, 520], [200, 400]], RED, 12);
};

// setup.e3.1
const e3s1 = (c: Ctx) => {
  ground(c);
  mwBody(c, 60, 220, 960, 640);
  shape(c, () => rrect(c, 100, 260, 660, 560, 18), "#aab2c0", 6);
  shape(c, () => rrect(c, 135, 295, 590, 490, 12), "#2c3045", 6);
  shine(c, [[170, 330], [240, 330]], 8);
  // the plate with the chocolate bar, in the middle
  shape(c, () => ell(c, 430, 715, 290, 60), "rgba(214,236,250,0.9)", 6);
  shape(c, () => ell(c, 430, 718, 240, 44), "rgba(255,255,255,0.35)", 4);
  
  shape(c, () => polyP(c, [[185, 665], [680, 665], [680, 710], [185, 710]]), "#4a2517", 5);
  shape(c, () => polyP(c, [[250, 565], [615, 565], [680, 665], [185, 665]]), "#7a4328", 5);
  for (let k = 1; k < 5; k++) { const t = k / 5; line(c, [[250 + 365 * t, 565], [185 + 495 * t, 665]], 4, "#4a2517"); }
  line(c, [[218, 615], [648, 615]], 4, "#4a2517");
  shine(c, [[290, 582], [420, 582]], 7);
  // control panel: the time and a grown-up's finger on a button
  shape(c, () => rrect(c, 790, 260, 190, 560, 14), "#bfc6d2", 6);
  shape(c, () => rrect(c, 810, 290, 150, 80, 8), "#22303a", 5);
  write(c, "20", 835, 306, 48, "#c9f06b", 8);
  [0, 1, 2].forEach((i) => [0, 1, 2].forEach((j) => shape(c, () => rrect(c, 812 + i * 50, 420 + j * 62, 42, 42, 8), COL.steelIn, 4)));
  handLeft(c, 1000, 540, 1.2, SKIN.adult, CLOTH.adult, true);
};

// setup.e3.2
const e3s2 = (c: Ctx) => {
  ground(c);
  shadow(c, 560, 600, 450, 22);
  const bar = () => rrect(c, 110, 300, 860, 290, 30);
  shape(c, bar, "#7a4328", 7); shade(c, bar, "#4a2517", 0, 22, 0.55);
  for (let k = 1; k < 10; k++) line(c, [[110 + k * 86, 305], [110 + k * 86, 585]], 4, "#4a2517");
  line(c, [[115, 397], [965, 397]], 4, "#4a2517"); line(c, [[115, 493], [965, 493]], 4, "#4a2517");
  shape(c, bar, "rgba(0,0,0,0)", 7);
  const spot = (x: number) => {
    const p = () => { c.moveTo(x - 62, 445); c.bezierCurveTo(x - 66, 385, x + 10, 372, x + 52, 400); c.bezierCurveTo(x + 78, 440, x + 66, 508, x + 8, 518); c.bezierCurveTo(x - 50, 524, x - 60, 495, x - 62, 445); c.closePath(); };
    shape(c, p, "#c98458", 5); shade(c, p, "#9a5a34", 12, 10, 0.5); shine(c, [[x - 30, 415], [x + 12, 402]], 10);
  };
  [210, 510, 810].forEach(spot);
  // ruler: 0 under the first spot, 50 px = 1 cm
  shape(c, () => polyP(c, [[120, 650], [1000, 650], [1000, 770], [120, 770]]), COL.wood, 6);
  for (let k = -1; k <= 15; k++) { const x = 210 + k * 50; line(c, [[x, 650], [x, 692]], 5); line(c, [[x + 25, 650], [x + 25, 672]], 3); if (k >= 0) write(c, String(k), x - (k > 9 ? 17 : 8), 706, 26, INK, 4); }
  // red guides from the first two spots down to the ruler, and the gap between them
  line(c, [[210, 520], [210, 648]], 7, RED); line(c, [[510, 520], [510, 648]], 7, RED);
  line(c, [[210, 830], [510, 830]], 8, RED); line(c, [[210, 810], [210, 850]], 8, RED); line(c, [[510, 810], [510, 850]], 8, RED);
  write(c, "6 cm", 295, 870, 80, INK, 10);
};

export const su_lightWhatIsLight = cards("sci.light.what-is-light.L3 set-up", [e1s0, e1s1, e1s2, e2s0, e2s1, e2s2, e2s3, e3s0, e3s1, e3s2]);
