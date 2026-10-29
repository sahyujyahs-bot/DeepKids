import { Gfx, type Ctx, type Env, type Medium, type P } from "./core";
import { mix } from "./gallery";
import { area, camSet, edge, trace, type Cam, type Plate } from "./gouache";

// PICTURE-BOOK WATERCOLOUR + PENCIL (the hand of the storybook reference the founder chose: soft
// watercolour flats on warm cold-press, the pigment settling darker along each wet edge, then a
// thin soft pencil line round every form, boiling a little from frame to frame). Same scene
// geometry as the gouache plates; only the hand changes.
export const PENCIL_WC: Medium = { nib: 1.2, taper: 1, pressure: 0.9, retrace: true, wobble: 0.9, rough: 0.8 };
const GRAPHITE = "#4a3d3e";
export const drawWC = (ctx: Ctx, env: Env, pl: Plate, o: { f?: number; cam?: Cam; boil?: number; paper?: number; outline?: boolean } = {}) => {
  const f = o.f ?? 0, cam = o.cam ?? { x: 0, y: 0, s: 1 }, boil = o.boil ?? 0.45, big = 0.45 * 1080 * 1920;
  camSet(ctx, env, cam);
  // each form: its wash, the pigment pooled along the wet edge, then its pencil line, in the plate's
  // order, so a nearer form covers the line of the one behind it as paint on paper does
  const g = new Gfx(ctx, env, f, PENCIL_WC);
  g.push(cam.x, cam.y, cam.s);
  pl.shapes.forEach((s, i) => {
    const e = edge(s.pts, i), a = area(s.pts);
    camSet(ctx, env, cam); ctx.fillStyle = s.col; trace(ctx, e); ctx.fill();
    if (s.ink !== 0 && !s.col.startsWith("rgba") && a > 60 && a < big) { ctx.save(); trace(ctx, e); ctx.clip(); ctx.strokeStyle = mix(s.col, "#2a1e26", 0.32); ctx.globalAlpha = 0.4; ctx.lineWidth = Math.min(7, 1.5 + Math.sqrt(a) * 0.02); trace(ctx, e); ctx.stroke(); ctx.restore(); }
    if ((o.outline ?? true) && s.ink !== 0 && a >= 140 && a <= big) { g.pen(s.pts as P[], { closed: true, w: s.ink ?? Math.min(2.4, 0.9 + Math.sqrt(a) * 0.006), color: GRAPHITE, seed: 900 + i, wobble: 0.7, boil, taper: 0.6, opacity: 0.78, retrace: false }); }
  });
  g.group("ink", () => pl.lines.forEach((l) => g.pen(l.pts, { w: l.w, color: l.col === "#1d1a17" ? GRAPHITE : l.col, seed: l.seed, wobble: 0.6, boil, opacity: 0.85 })));
  g.pop();
  g.paper("coldpress", o.paper ?? 0.16);
};
