import type { Ctx } from "./core";
import type { Film } from "./film";
import { D, ground, shadow, shape, rrect, line, ell, person, hand, COL, SKIN, CLOTH, INK, WHITE, cards } from "./flatKit";
// 1 child holds a torch out to the right; 2 a grown-up points at the moon; 3 a child sits and taps a tin with a spoon; 4 both hold a book between them
const floor = (c: Ctx, y: number) => { c.fillStyle = "#e4d3b3"; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };
const torch = (c: Ctx, x: number, y: number) => { shape(c, () => rrect(c, x - 20, y - 26, 150, 52, 14), COL.blue); shape(c, () => rrect(c, x + 118, y - 40, 40, 80, 10), COL.steel); };
export const figTest: Film = cards("figtest", [
  (c) => { ground(c); floor(c, 760); shadow(c, 450, 770, 150, 22); const h = person(c, 450, 760, 620, { reachR: [690, 470], reachL: [330, 560] }); torch(c, h.handR[0] - 10, h.handR[1]); },
  (c) => { ground(c, "#243a66"); floor(c, 800); c.fillStyle = "#f6ecc0"; c.beginPath(); c.arc(820, 250, 90, 0, 7); c.fill(); const h = person(c, 400, 800, 640, { adult: true, reachR: [740, 300], reachL: [330, 590] }); },
  (c) => { ground(c); floor(c, 760); const tx = 520, ty = 700; shape(c, () => rrect(c, tx - 50, ty - 90, 100, 100, 10), COL.steel); const h = person(c, 380, 780, 560, { sit: true, dir: 1, reachR: [tx, ty - 95], reachL: [330, 680] }); line(c, [[h.handR[0] - 40, h.handR[1] + 30], [h.handR[0] + 70, h.handR[1] - 20]], 12, COL.steelDk); },
  (c) => { ground(c); floor(c, 780); person(c, 300, 780, 600, { reachR: [470, 520], reachL: [330, 560] }); person(c, 640, 780, 600, { adult: true, reachL: [470, 520], reachR: [700, 560] }); shape(c, () => rrect(c, 410, 470, 120, 90, 8), COL.red); },
]);
