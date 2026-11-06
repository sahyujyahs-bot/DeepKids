import type { Ctx } from "./core";
import type { Film } from "./film";
import { D, ground, shape, rrect, line, ell, person, COL, INK, cards } from "./flatKit";
// four poses: holding out a torch; pointing at the moon; sitting and tapping a tin with a spoon; sharing a book
const floor = (c: Ctx, y: number) => { c.fillStyle = "#e4d3b3"; c.fillRect(0, y, D, D - y); line(c, [[0, y], [D, y]], 6); };
export const figTest: Film = cards("figtest", [
  (c) => { ground(c); floor(c, 800); const h = person(c, 500, 800, 640, { reachR: [790, 520], reachL: [310, 620] }); shape(c, () => rrect(c, h.handR[0] - 30, h.handR[1] - 26, 150, 52, 14), COL.blue); shape(c, () => rrect(c, h.handR[0] + 112, h.handR[1] - 42, 40, 84, 10), COL.steel); },
  (c) => { ground(c, "#243a66"); floor(c, 830); c.fillStyle = "#f6ecc0"; c.beginPath(); c.arc(830, 230, 90, 0, 7); c.fill(); person(c, 380, 830, 700, { adult: true, reachR: [780, 330], reachL: [260, 640] }); },
  (c) => { ground(c); floor(c, 740); shape(c, () => rrect(c, 560, 600, 110, 130, 12), COL.steel); const h = person(c, 400, 810, 600, { sit: true, reachR: [610, 585], reachL: [262, 770] }); line(c, [[h.handR[0] - 10, h.handR[1] + 4], [h.handR[0] + 70, h.handR[1] - 34]], 12, COL.steelDk); },
  (c) => { ground(c); floor(c, 800); person(c, 330, 800, 600, { reachR: [510, 540], reachL: [250, 650] }); person(c, 720, 800, 700, { adult: true, reachL: [520, 540], reachR: [800, 640] }); shape(c, () => rrect(c, 470, 510, 100, 80, 8), COL.red); },
]);
