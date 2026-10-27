import { rng, type Ctx, type Env, type P } from "./core";
import type { Film } from "./film";
import { clamp, mix } from "./gallery";
import { camSet, drawPlate, ell, frame, lerpP, limb, plate, sm, type Cam, type Plate } from "./gouache";

// THE NAP · DeepKids Gurukul launch film, the opening (look still), in Mid-century gouache.
//
// IDEA: a mother has fallen asleep mid-morning at the dining table, deep in her child's lessons,
// and the morning sun lays the window grille across her arm and her notebook.
// LIGHT: one sun, low in the east, through the grille of the window on the right: hard lit
// patches on the table in the grille's pattern, falling down and left; the room in warm shade.
// SUBJECT & REFERENCE: Amma, 38, South Indian, from the founder's reference: teal cotton saree
// with a mustard-gold border, the pallu over her left shoulder, a loose bun coming apart, a small
// maroon bindi, a gold stud and a thin gold chain of bangles. Her head lies on her left forearm,
// face to us, crown up-right; her right arm is flung out across the notebook, palm down, the pen
// slipping from curled fingers (thumb on the far side, right hand palm down). Mouth open, a
// thread of drool to her sleeve. Chennai flat: turmeric wall, a teak window with a painted
// iron grille, coconut fronds outside, a wall clock at ten past ten.
// THE TABLE, every object a door into the dream: an open notebook, a stack of books, a steel
// bowl of water with a needle floating on a leaf (the compass), a burr stuck to a strip of
// Velcro on a card, a seed sprouting in a steel cup, Kavya's crayon kingfisher, a steel
// tumbler of pencils (no coffee).

const W = 1080, H = 1920;
const C = {
  wall: "#e0ad4c", wallD: "#c8923a", teak: "#6a3a22", teakD: "#4b2716", teakL: "#8a5132", haze: "#fbf1d2", palm: "#86a653", palmD: "#5d7f3c", nbr: "#eadcc0",
  grille: "#5f9a8b", table: "#7c3d21", tableD: "#663117", tableL: "#8f4c2b",
  skin: "#bb7a4b", skinD: "#8e5535", skinL: "#d6996a", lip: "#7e3b31", mouth: "#3d1714", hair: "#1c1715", hairL: "#3a2e29", bindi: "#9f1f2a", gold: "#d7a53c", goldD: "#a87a22",
  blouse: "#22564f", saree: "#2e7a6c", sareeD: "#24635a", border: "#d8a73d", borderD: "#a37620",
  page: "#f4ead0", pageD: "#e3d5b3", rule: "#8eaac0", red: "#c0432c", blue: "#3d6c9c", mustard: "#e0a733", green: "#5d8f4a",
  steel: "#b7bbbf", steelD: "#8d9297", steelL: "#e3e5e6", water: "#a9c3c8", leaf: "#6f9a3c", ink: "#1d1a17", cream: "#f6ecd2", tomato: "#d2462a", turq: "#56aba2",
};
const bar = (a: P, b: P, w: number) => limb([a, b], [w, w], 2).poly;

// wake: 0 asleep .. 1 awake (eyes open at .35, the smile at .5, the head lifts from .5); later: the clock at 11:05, the phone lit
export type Wake = { wake: number; later: boolean; phone: number };
// clock: seconds after 10:00:00 on the wall clock (10:10 when she falls asleep, 11:05 when she wakes)
export const buildNap = (o: { breath?: number; w?: Wake; clock?: number } = {}): Plate => {
  const { S, L, D, ...pl } = plate(), r = rng(1038), br = o.breath ?? 0, wk = o.w?.wake ?? 0, later = o.w?.later ?? false, lift = clamp((wk - 0.5) / 0.5);
  // ---------------- the room behind her
  S([[-10, -10], [W + 10, -10], [W + 10, 1000], [-10, 1000]], C.wall);
  S([[-10, 760], [W + 10, 740], [W + 10, 1000], [-10, 1000]], C.wallD);                        // the wall falls into shade toward the table
  for (let i = 0; i < 6; i++) { const y = 90 + i * 112 + r() * 40, x = r() * 160; D([[x, y], [x + 220 + r() * 160, y - 30]], 22, mix(C.wall, "#ffffff", 0.18)); }
  for (let i = 0; i < 3; i++) { const y = 800 + i * 60; D([[20 + i * 60, y], [300 + i * 50, y - 16]], 18, mix(C.wallD, C.teakD, 0.25)); }
  // the window, teak frame, bright haze, fronds and a neighbour's terrace
  S([[498, 46], [W + 10, 46], [W + 10, 808], [498, 808]], C.teak);
  S([[540, 88], [W + 10, 88], [W + 10, 762], [540, 762]], C.haze);
  S([[540, 560], [800, 540], [W + 10, 520], [W + 10, 762], [540, 762]], C.nbr);
  S([[540, 560], [800, 540], [W + 10, 520], [W + 10, 534], [800, 556], [540, 576]], mix(C.nbr, C.teak, 0.25));
  const frond = (b: P, a: number, len: number, col: string) => { const pts: P[] = [], back: P[] = []; for (let i = 0; i <= 10; i++) { const t = i / 10, x = b[0] + Math.cos(a) * len * t, y = b[1] + Math.sin(a) * len * t + t * t * len * 0.25, w = Math.sin(Math.PI * t) * len * 0.1; for (let k = 0; k < 1; k++) { pts.push([x - Math.sin(a) * w, y + Math.cos(a) * w]); back.push([x + Math.sin(a) * w * 0.4, y - Math.cos(a) * w * 0.4]); } } S([...pts, ...back.reverse()], col); };
  frond([1090, 110], 2.6, 330, C.palmD); frond([1090, 160], 3.0, 300, C.palm); frond([1090, 70], 2.2, 240, C.palm); frond([1090, 250], 3.4, 260, C.palmD);
  // the grille: painted iron bars and a diamond in each bay
  [600, 690, 780, 870, 960, 1050].forEach((x) => S(bar([x, 88], [x, 762], 4.2), C.grille));
  [300, 540].forEach((y) => S(bar([540, y], [W + 10, y], 4.2), C.grille));
  [600, 690, 780, 870, 960].forEach((x) => [194, 420, 650].forEach((y) => { const cx = x + 45, h = y === 420 ? 90 : 70; const d: P[] = [[cx, y - h], [cx + 36, y], [cx, y + h], [cx - 36, y]]; d.forEach((p, i) => S(bar(p, d[(i + 1) % 4], 2.6), C.grille)); }));
  S([[480, 790], [W + 10, 790], [W + 10, 826], [470, 826]], C.teakL);                             // the sill
  // the clock at ten past ten, and Kavya's drawings taped to the wall
  S(ell(214, 300, 92, 92), C.teak); S(ell(214, 300, 78, 78), C.cream);
  S([[300, 120], [462, 112], [470, 330], [306, 336]], C.cream); S(ell(386, 210, 40, 40), C.mustard); for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; S(bar([386 + Math.cos(a) * 48, 210 + Math.sin(a) * 48], [386 + Math.cos(a) * 66, 210 + Math.sin(a) * 66], 3), C.tomato); }
  S([[330, 104], [362, 102], [362, 124], [330, 126]], "#e8e2c8");
  // ---------------- Amma: the back of her, saree and blouse, slumped forward
  const sy = br * 5;
  S(sm([[290, 1000], [300, 930], [340, 868 - sy], [430, 800 - sy], [560, 744 - sy], [690, 748 - sy], [800, 800 - sy], [870, 860 - sy], [905, 940], [910, 1000]]), C.blouse);
  // the pallu over her left shoulder, a diagonal sweep of saree, the border along its edge
  const pallu = sm([[840, 830 - sy], [890, 880 - sy], [912, 1000], [330, 1000], [352, 966], [520, 900 - sy * 0.5], [700, 852 - sy]]);
  S(pallu, C.saree);
  D([[440, 800], [520, 990]], 18, mix(C.blouse, C.ink, 0.2)); D([[720, 790], [840, 980]], 18, C.sareeD);
  S(sm([[840, 830 - sy], [700, 852 - sy], [520, 900 - sy * 0.5], [352, 966], [346, 986], [522, 920 - sy * 0.5], [702, 872 - sy], [846, 852 - sy]], true, 4), C.border);
  // ---------------- the table
  S([[-10, 990], [W + 10, 984], [W + 10, H + 10], [-10, H + 10]], C.table);
  for (let i = 0; i < 16; i++) { const y = 1004 + i * 58 + r() * 26, x = -40 + r() * 600; D([[x, y], [x + 260 + r() * 380, y + 6]], 10, i % 2 ? C.tableD : C.tableL); }
  // ---------------- the folded arm under her head: sleeve, upper arm, forearm along the table
  const fa = limb([[880, 880 - sy], [985, 985], [820, 1040], [560, 1092], [470, 1104]], [40, 34, 33, 30, 27], 8);
  S(fa.poly, C.skin);
  S(sm([[836, 856 - sy], [900, 862 - sy], [944, 916], [926, 950], [870, 944], [846, 900]]), C.blouse);
  S(sm([[870, 944], [926, 950], [930, 962], [868, 958]]), C.border);
  L(fa.b.filter(([x, y]) => x > 790 && y > 930), 1.5);                // the top of the forearm
  // ---------------- the flung arm: blouse sleeve, upper arm, forearm, the hand on the notebook
  // the notebook first (her arm lies on it)
  const nb: [P, P, P, P] = [[120, 1268], [700, 1232], [770, 1612], [96, 1668]], spine0 = lerpP(nb[0], nb[1], 0.5), spine1 = lerpP(nb[3], nb[2], 0.5);
  S([[110, 1278], [708, 1240], [782, 1626], [86, 1680]], C.pageD);
  S([nb[0], spine0, spine1, nb[3]], C.page); S([spine0, nb[1], nb[2], spine1], mix(C.page, "#ffffff", 0.25));
  for (let i = 1; i < 12; i++) { const t = i / 12, a = lerpP(nb[0], nb[3], t), b = lerpP(spine0, spine1, t), c = lerpP(nb[1], nb[2], t); L([lerpP(a, b, 0.06), lerpP(a, b, 0.96)], 0.9, C.rule); L([lerpP(b, c, 0.05), lerpP(b, c, 0.95)], 0.9, C.rule); }
  for (let i = 0; i < 6; i++) { const t = 0.12 + i * 0.07, b = lerpP(spine0, spine1, t), c = lerpP(nb[1], nb[2], t), pts: P[] = []; for (let k = 0; k <= 14; k++) { const q = lerpP(lerpP(b, c, 0.1), lerpP(b, c, 0.1 + 0.45 + r() * 0.35), k / 14); pts.push([q[0], q[1] - 3 + Math.sin(k * 1.9 + i) * 3]); } L(pts, 1.2, "#2b3a55"); }
  L([spine0, spine1], 1.4);
  const ra = limb([[352, 900 - sy], [250, 1080], [168, 1226], [236, 1372], [304, 1494]], [44, 39, 35, 30, 25], 5);
  S(ra.poly, C.skin);
  S(sm([[300, 880 - sy], [400, 860 - sy], [410, 930], [330, 1010], [262, 1010], [262, 940]]), C.blouse);
  S(sm([[262, 1006], [330, 1006], [326, 1024], [258, 1022]]), C.border);
  // the hand: palm down, fingers curled over the pen, thumb on the far side
  const Hd = frame([300, 1496], 0.36);
  S([Hd(-120, -3), Hd(-90, 1)].length ? [Hd(-6, -30), Hd(40, -38), Hd(92, -34), Hd(104, 0), Hd(96, 34), Hd(40, 36), Hd(-4, 26)] : [], C.skin);
  const fingers: [number, number, number][] = [[-26, 46, 10], [-8, 52, 10.5], [10, 48, 10], [27, 38, 9]];
  fingers.forEach(([v, len, w]) => { const k = limb([Hd(92, v * 0.9), Hd(92 + len * 0.62, v * 1.02), Hd(92 + len, v * 1.08 + 4)], [w, w * 0.92, w * 0.8], 4); S(k.poly, C.skin); });
  const thumb = limb([Hd(18, -32), Hd(56, -50), Hd(86, -52)], [12, 10, 8.5], 4); S(thumb.poly, C.skin);
  // the pen, slipping
  S(bar(Hd(70, 30), Hd(200, 88), 5.5), C.blue); S(bar(Hd(196, 86), Hd(214, 94), 3), C.steelD);
  // bangles: thin gold at the wrist
  [[-14, 0], [-24, 0]].forEach(([u]) => S(bar(Hd(u, -33), Hd(u + 6, 34), 2.6), C.gold));
  // ---------------- the head on the forearm, face to us, crown up and right
  const F = frame([606 + 26 * lift, 948 - 70 * lift], 1.12 - 0.42 * lift);
  // hair behind the head: the bun coming loose, spilling over the arm
  S(sm([F(-70, -96), F(-20, -150), F(50, -178), F(110, -150), F(130, -80), F(118, 10), F(96, 60), F(80, -40)]), C.hair);
  S(ell(...F(44, -168), 58, 50, 1.12 + 0.3), C.hair);
  S(sm([F(108, -60), F(140, -30), F(150, 40), F(128, 90), F(108, 120), F(90, 70)]), C.hair);
  // the neck going back into the shoulders
  // the face
  const face = sm([F(-84, -60), F(-48, -84), F(0, -90), F(50, -84), F(86, -56), F(92, 0), F(84, 52), F(60, 92), F(26, 116), F(0, 120), F(-28, 114), F(-60, 90), F(-82, 50), F(-90, 0)]);
  S(face, C.skin);
  S(sm([F(40, -60), F(86, -56), F(92, 0), F(84, 52), F(60, 92), F(40, 100), F(56, 40), F(58, -10)]), C.skinD);   // the cheek pressed on the arm, in shade
  S(ell(...F(-46, 34), 22, 14, 1.12), mix(C.skin, C.lip, 0.22));                                     // the upper cheek, warm
  // the ear and its gold stud, on the up side
  S(ell(...F(-94, 4), 12, 24, 1.12), C.skinD); S(ell(...F(-96, 34), 6, 6), C.gold);
  // the hairline: hair over the forehead and the up-side temple
  S(sm([F(-92, -64), F(-96, -110), F(-30, -134), F(60, -128), F(104, -90), F(90, -66), F(50, -86), F(10, -92), F(-40, -88), F(-80, -70)]), C.hair);
  S(sm([F(-68, -36), F(-44, -46), F(-18, -42), F(-20, -36), F(-44, -38), F(-66, -30)], true, 3), C.hair); S(sm([F(16, -42), F(40, -46), F(64, -36), F(62, -30), F(40, -38), F(18, -36)], true, 3), C.hair);
  // the open mouth and the drool while she sleeps; awake, a closed smile
  if (wk < 0.5) {
    const m = F(4, 80);
    S(ell(m[0], m[1], 20, 13, 1.12), C.lip); S(ell(...F(5, 81), 14, 8, 1.12), C.mouth); S(sm([F(-6, 75), F(14, 76), F(12, 78), F(-4, 77)]), "#efe6d6");
    if (wk < 0.3) { const dc = F(22, 84), dl: P = [dc[0] + 6, 1050]; S(sm([dc, [dc[0] + 3, dc[1] + 10], [dl[0] + 1.2, dl[1] - 6], [dl[0] - 1.2, dl[1] - 6], [dc[0] + 0.5, dc[1] + 10]], true, 3), "#d9e4e6"); S(ell(dl[0], dl[1], 7, 4.5), "#dbe6e8"); }
  } else { S(sm([F(-18, 74), F(4, 80), F(26, 72), F(24, 78), F(4, 88), F(-16, 80)], true, 3), C.lip); }
  // open eyes when she wakes: whites, dark irises looking toward the phone
  if (wk >= 0.35) [[-42, -8], [38, -6]].forEach(([u, v]) => { const e = F(u, v); S(ell(e[0], e[1], 15, 9, 1.12 - 0.42 * lift), "#f4efe2"); S(ell(...F(u + 4, v + 1), 7, 7.5), C.ink); });
  // the phone on the table, face up; it lights when she wakes
  const ph = o.w?.phone ?? 0;
  S([[790, 1122], [960, 1110], [968, 1204], [796, 1216]], "#24212b"); S([[800, 1128], [950, 1118], [957, 1196], [806, 1207]], ph > 0 ? mix("#2b2f3d", "#1E1436", ph) : "#2b2f3d");
  if (ph > 0.3) { S([[808, 1134], [944, 1125], [946, 1150], [810, 1159]], mix("#1E1436", "#3a2c6e", ph)); S([[810, 1160], [946, 1151], [951, 1192], [812, 1200]], mix("#2b2f3d", "#FCFCF8", ph)); }
  S(ell(...F(0, -52), 5.5, 5.5), C.bindi);
  // ---------------- the things on the table
  // a stack of books
  const book = (x0: number, y0: number, w: number, d: number, th: number, col: string, sk: number) => { const a: P = [x0, y0], b: P = [x0 + w, y0 - sk], c: P = [x0 + w + 14, y0 - sk + d], e: P = [x0 + 12, y0 + d]; S([e, c, [c[0], c[1] + th], [e[0], e[1] + th]], C.page); S([[e[0] - 2, e[1]], [e[0] + 18, e[1]], [e[0] + 18, e[1] + th + 2], [e[0] - 2, e[1] + th + 2]], mix(col, C.ink, 0.25)); S([a, b, c, e], col); L([a, b, c, e], 1.3, C.ink, true); L([[e[0] + 18, e[1] + th], [c[0], c[1] + th]], 1.1); };
  book(742, 1430, 300, 120, 34, C.mustard, 14); book(756, 1364, 290, 112, 30, C.blue, 10); book(770, 1300, 276, 104, 28, C.red, 16);
  S([[798, 1312], [1012, 1298], [1018, 1330], [804, 1344]], mix(C.red, C.cream, 0.55));
  // the steel bowl of water with a needle floating on a leaf (the compass)
  S(ell(860, 1740, 150, 58), C.steelD); S(ell(860, 1732, 146, 52), C.steel); S(ell(860, 1738, 126, 42), C.water);
  S(ell(872, 1736, 46, 17, -0.25), C.leaf); S(bar([826, 1748], [920, 1722], 1.8), C.steelD); S(ell(918, 1723, 3, 3), C.tomato);
  L(ell(860, 1732, 146, 52, 0, 40), 1.3, C.ink, true);
  // the burr stuck on a strip of Velcro on a card, and a magnifying glass
  S([[476, 1660], [660, 1640], [672, 1736], [486, 1758]], C.cream); S([[500, 1690], [646, 1674], [650, 1700], [503, 1716]], "#4a6a8a");
  { const cx = 600, cy = 1688; S(ell(cx, cy, 20, 18), "#7a4a24"); for (let i = 0; i < 26; i++) { const a = (i / 26) * Math.PI * 2; L([[cx + Math.cos(a) * 14, cy + Math.sin(a) * 13], [cx + Math.cos(a) * 27, cy + Math.sin(a) * 25], [cx + Math.cos(a + 0.4) * 27, cy + Math.sin(a + 0.4) * 25]], 1.1, "#4a2a14"); } }
  S(ell(544, 1806, 50, 46), C.teakD); S(ell(544, 1806, 41, 37), mix(C.haze, C.table, 0.35)); S(bar([580, 1838], [640, 1900], 9), C.teakD);
  // a seed sprouting in a little steel cup
  S([[338, 1790], [418, 1790], [410, 1880], [346, 1880]], C.steel); S(ell(378, 1790, 40, 12), C.steelD); S(ell(378, 1792, 34, 9), "#5a3a26");
  S(bar([378, 1790], [382, 1740], 2.2), C.green); S(ell(368, 1740, 13, 6, -0.5), C.green); S(ell(394, 1734, 13, 6, 0.4), C.green);
  // Kavya's crayon kingfisher on a sheet sliding under the notebook
  S([[96, 1700], [330, 1690], [318, 1910], [80, 1920]], C.cream);
  S(sm([[140, 1800], [190, 1770], [250, 1776], [270, 1796], [230, 1820], [160, 1824]]), "#2f7fb6"); S(sm([[170, 1814], [240, 1812], [224, 1840], [180, 1838]]), C.tomato); S([[268, 1792], [320, 1800], [266, 1802]], C.ink); S(ell(244, 1790, 4, 4), C.ink);
  // a steel tumbler of pencils, no coffee
  S([[18, 1490], [96, 1490], [88, 1620], [26, 1620]], C.steel); S(ell(57, 1490, 39, 10), C.steelD);
  [[36, C.tomato], [52, C.green], [66, C.mustard], [80, C.blue]].forEach(([x, col], i) => { S(bar([x as number, 1492], [(x as number) - 14 + i * 9, 1370 - i * 12], 5), col as string); });
  // ---------------- the line, off register: face first, then hands, hair, the rest
  const Lf = (pts: P[], w = 1.8) => L(pts, w);
  Lf([F(-84, -50), F(-90, 0), F(-82, 50), F(-60, 90), F(-28, 114), F(0, 120), F(26, 116), F(60, 92)], 2);
  if (wk < 0.35) Lf([F(-64, -12), F(-50, -4), F(-34, -4), F(-20, -10)], 2); if (wk < 0.35) { Lf([F(-58, -9), F(-62, 0)], 1.2); Lf([F(-46, -4), F(-48, 4)], 1.1); Lf([F(-34, -4), F(-34, 4)], 1.1); }      // a closed eye, its lashes
  if (wk < 0.35) { Lf([F(18, -10), F(32, -4), F(48, -4), F(60, -12)], 2); Lf([F(32, -4), F(32, 3)], 1.1); Lf([F(46, -4), F(47, 3)], 1.1); }
  Lf([F(-66, -34), F(-44, -42), F(-20, -38)], 2.2); Lf([F(16, -38), F(40, -42), F(62, -32)], 2.2);
  Lf([F(-4, 8), F(-8, 30), F(-12, 42), F(-6, 49)], 1.6); Lf([F(-4, 48), F(4, 46), F(12, 49)], 1.4); Lf([F(16, 40), F(18, 47), F(14, 51)], 1.3);
  if (wk < 0.5) { Lf([F(-14, 78), F(4, 73), F(22, 79)], 1.4); Lf([F(-12, 84), F(4, 92), F(20, 86)], 1.2); }
  Lf([F(-98, -6), F(-104, 10), F(-98, 26)], 1.3);
  // loose strands of hair over the forehead and the arm
  [[-70, -82, -84, -50, -96, -20], [-20, -94, -40, -74, -58, -62]].forEach(([a, b, c, d, e, f]) => L(sm([F(a, b), F(c, d), F(e, f)], false, 6), 1.3, C.hair));
  Lf([F(-60, -120), F(10, -150), F(80, -170)], 1.4); Lf([F(20, -200), F(70, -210), F(100, -180)], 1.3);
  // her hand: knuckles, fingers apart, the thumb
  fingers.forEach(([v, len]) => { L([Hd(92, v * 0.9 - 8), Hd(92 + len, v * 1.08 - 4)], 1.2); });
  L([Hd(90, -38), Hd(96, -10), Hd(94, 18), Hd(88, 38)], 1.3); L(thumb.a.slice(2), 1.3); L([Hd(0, 30), Hd(40, 38), Hd(70, 40)], 1.4);
  L(ra.a.slice(Math.round(ra.a.length * 0.3), Math.round(ra.a.length * 0.95)), 1.5); L(ra.b.slice(Math.round(ra.b.length * 0.55)), 1.5); L([[150, 1206], [140, 1232], [156, 1258]], 1.4);   // the elbow
  // saree folds, the pallu edge, the clock, the drawing
  Lf([[380, 930], [400, 962], [404, 998]], 1.3); Lf([[760, 890], [800, 940], [820, 1000]], 1.3); Lf([[560, 760], [620, 800], [700, 830]], 1.2); Lf([[470, 820], [440, 900], [430, 990]], 1.3);
  L(ell(214, 300, 92, 92, 0, 40), 1.6, C.ink, true); { const sec = 36000 + (o.clock ?? (later ? 3900 : 600)), hand = (a: number, len: number): P => [214 + Math.sin(a) * len, 300 - Math.cos(a) * len];
    L([[214, 300], hand(((sec / 3600) % 12) / 12 * Math.PI * 2, 44)], 3.4); L([[214, 300], hand(((sec / 60) % 60) / 60 * Math.PI * 2, 64)], 2.6);
    L([hand((Math.floor(sec) % 60) / 60 * Math.PI * 2 + Math.PI, 14), hand((Math.floor(sec) % 60) / 60 * Math.PI * 2, 70)], 1.2, C.tomato); }
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; L([[214 + Math.cos(a) * 66, 300 + Math.sin(a) * 66], [214 + Math.cos(a) * 74, 300 + Math.sin(a) * 74]], 1.6); }
  L([[300, 120], [462, 112], [470, 330], [306, 336]], 1.2, C.ink, true);
  L([[498, 46], [498, 808]], 1.6); L([[540, 88], [540, 762]], 1.4);
  return pl;
};

// the morning sun through the grille: hard lit patches on the table, the arm and the notebook
const sunLayer = (env: Env, later: boolean) => {
  const k = `nap:sun:${env.scale}:${later}`; let L = env.cache.get(k) as ReturnType<Env["canvas"]> | undefined; if (L) return L;
  L = env.canvas(Math.round(W * env.scale), Math.round(H * env.scale)); const c = L.ctx; c.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  // the window's light, thrown down and left onto the table: a skewed copy of the grille
  const P0: P = later ? [470, 1050] : [300, 1090], ux: P = [0.82, -0.05], uy: P = [-0.34, 0.86], map = (x: number, y: number): P => [P0[0] + ux[0] * x + uy[0] * y, P0[1] + ux[1] * x + uy[1] * y];
  c.fillStyle = "#ffd98c"; c.beginPath(); const q = [map(0, 0), map(560, 0), map(560, 660), map(0, 660)]; q.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.fill();
  c.globalCompositeOperation = "destination-out"; c.strokeStyle = "#000"; c.lineCap = "butt";
  const st = (a: P, b: P, w: number) => { c.lineWidth = w; c.beginPath(); c.moveTo(...a); c.lineTo(...b); c.stroke(); };
  [60, 150, 240, 330, 420, 510].forEach((x) => st(map(x, 0), map(x, 660), 9));
  [212, 450].forEach((y) => st(map(0, y), map(560, y), 9));
  [60, 150, 240, 330, 420].forEach((x) => [106, 332, 562].forEach((y) => { const cx = x + 45, h = y === 332 ? 90 : 70, d: P[] = [map(cx, y - h), map(cx + 36, y), map(cx, y + h), map(cx - 36, y)]; d.forEach((p, i) => st(p, d[(i + 1) % 4], 5.5)); }));
  env.cache.set(k, L); return L;
};

export const drawNap = (ctx: Ctx, f: number, env: Env, o: { cam?: Cam; dream?: number; w?: Wake; clock?: number } = {}) => {
  const breath = (Math.sin((f / 30) * Math.PI * 2 * 0.22) + 1) / 2, bq = Math.round(breath * 8) / 8, w = o.w, later = w?.later ?? false;
  const key = `nap:plate:${bq}:${o.clock ?? ""}:${w ? [w.wake.toFixed(2), later, w.phone.toFixed(2)].join(",") : "s"}`;
  let pl = (o.dream ?? 0) > 0 || w ? undefined : (env.cache.get(key) as Plate | undefined);
  if (!pl) { pl = buildNap({ breath: bq, w, clock: o.clock }); if (!((o.dream ?? 0) > 0 || w)) env.cache.set(key, pl); }
  const cam = o.cam ?? { x: 0, y: 0, s: 1 };
  drawPlate(ctx, env, pl, key + ":e", {
    f, cam, dream: o.dream, between: () => {
      const L = sunLayer(env, later); ctx.save(); camSet(ctx, env, cam); ctx.scale(1 / env.scale, 1 / env.scale); ctx.globalCompositeOperation = "soft-light"; ctx.globalAlpha = 1; ctx.drawImage(L.canvas as CanvasImageSource, 0, 0); ctx.globalCompositeOperation = "screen"; ctx.globalAlpha = 0.16; ctx.drawImage(L.canvas as CanvasImageSource, 0, 0); ctx.restore();
    },
  });
};

export const nap: Film = {
  meta: { title: "DeepKids Gurukul · the nap (look)", W, H, fps: 30, bpm: 90, durationFrames: 60 },
  assets: { images: {} },
  shots: [{ id: "nap", start: 0, end: 60, draw: drawNap }],
};
