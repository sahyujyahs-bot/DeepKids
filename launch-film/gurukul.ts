import type { Ctx, Env, P } from "./core";
import type { Film } from "./film";
import { clamp, lerp } from "./gallery";
import { drawPlate, type Cam } from "./gouache";
import { drawNap } from "./nap";
import { drawApp, app } from "./app";
import { filmScore } from "./score";
import { score } from "./gurukulScore";
import { banyan, buildBanyan, buildCompass, buildKing, buildMirrors, buildVelcro, compass, cosmos, cosmosLayer, king, mirrors, velcro, ZOOM, type Circle, type Pl } from "./dream";

// DEEPKIDS GURUKUL · the launch film. 1080x1920, 30 fps, 45.5 s, in Mid-century gouache.
// STORY: a tired mother falls asleep mid-morning over her daughter's lessons; she dreams the
// lessons with her daughter, each one a wonder they share; she wakes up after her nap inspired,
// opens DeepKids Gurukul and taps "Log in". TOKEN: the things on her table (the burr, the bowl,
// the seed) come back as the dream's worlds. TURN: frame 150, the ink line slips its register.
// THE DREAM BLEND: the line plate drifts and boils and the flats breathe (gouache.ts `dream`), so
// waking life and the dream are the same picture losing and finding its register.
// SEAMS: match cuts on a round thing: each scene pushes into a circle (the burr, the sun, the
// train's lamp, the bowl, the seed, the canopy's gap, the tunnel's end, IAm's third eye, her eye,
// the phone) and the next scene grows out of the matching circle in it.

const W = 1080, H = 1920, FPS = 30, BPM = 120; // a beat is 15 frames; every cut is on a beat
type Scene = { id: string; start: number; len: number; bg?: string; entry?: Circle; exit?: Circle; draw: (ctx: Ctx, t: number, env: Env, cam: Cam, dream: number) => void };
const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const plateScene = (build: (t: number) => Pl, id: string) => (ctx: Ctx, t: number, env: Env, cam: Cam, dream: number) => drawPlate(ctx, env, build(t), id, { f: t, dream, cam });
const q = (x: number, n = 50) => Math.round(clamp(x) * n) / n;

// the cosmos: five nested pictures; layer k sits inside layer k+1 at PIN[k], 1/ZOOM of its size
const PIN: P[] = [[600, 900], [560, 1000], [560, 930], [300, 520]];
const C0: P = [540, 960];
const G: P[] = (() => { const g: P[] = [[0, 0], [0, 0], [0, 0], [0, 0], [C0[0], C0[1]]]; for (let k = 3; k >= 0; k--) { const f = Math.pow(ZOOM, k + 1 - 4); g[k] = [g[k + 1][0] + (PIN[k][0] - C0[0]) * f, g[k + 1][1] + (PIN[k][1] - C0[1]) * f]; } return g; })();
const drawCosmos = (ctx: Ctx, t: number, env: Env, cam: Cam, dream: number) => {
  const Z = 4 * ease(clamp((t - 8) / 92)), k0 = Math.min(3, Math.floor(Z)), fr = Z - k0, w = (Math.pow(ZOOM, fr) - 1) / (ZOOM - 1);
  const focus: P = Z >= 4 ? G[4] : [lerp(G[k0][0], G[k0 + 1][0], w), lerp(G[k0][1], G[k0 + 1][1], w)], sZ = Math.pow(ZOOM, 4 - Z);
  for (let k = 4; k >= 0; k--) {
    const sk = Math.pow(ZOOM, k - Z); if (sk * 1100 < 2) continue; if (k > 0 && Math.pow(ZOOM, k - 1 - Z) >= 1.02) continue;
    const ox = W / 2 + (G[k][0] - focus[0]) * sZ - C0[0] * sk, oy = H / 2 + (G[k][1] - focus[1]) * sZ - C0[1] * sk;
    const c: Cam = { x: cam.x + ox * cam.s, y: cam.y + oy * cam.s, s: cam.s * sk };
    ctx.save(); if (k < 4) { ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0); ctx.beginPath(); ctx.arc(c.x + C0[0] * c.s, c.y + C0[1] * c.s, 520 * c.s + 580 * c.s * clamp((sk - 0.5) / 1.0), 0, Math.PI * 2); ctx.clip(); }
    drawPlate(ctx, env, cosmosLayer(k, t), "cosmos" + k, { f: t, dream, cam: c }); ctx.restore();
  }
};

const SCENES: Scene[] = [
  { id: "nap", start: 0, len: 225, exit: [600, 1688, 26], draw: (ctx, t, env, cam, dream) => drawNap(ctx, t, env, { cam, dream }) },
  { id: "velcro", start: 225, bg: "#8dbfd0", len: velcro.len, entry: velcro.entry, exit: velcro.exit, draw: plateScene(buildVelcro, "velcro") },
  { id: "king", start: 375, bg: "#f2c99a", len: king.len, entry: king.entry, exit: king.exit, draw: plateScene(buildKing, "king") },
  { id: "compass", start: 510, bg: "#7c3d21", len: compass.len, entry: compass.entry, exit: compass.exit, draw: plateScene(buildCompass, "compass") },
  { id: "banyan", start: 645, bg: "#bfe0dc", len: banyan.len, entry: banyan.entry, exit: banyan.exit, draw: plateScene(buildBanyan, "banyan") },
  { id: "mirrors", start: 780, bg: "#3b2f5c", len: mirrors.len, entry: mirrors.entry, exit: mirrors.exit, draw: plateScene(buildMirrors, "mirrors") },
  { id: "cosmos", start: 915, bg: "#2c2058", len: cosmos.len, entry: [540, 400, 14], exit: [600, 802, 11], draw: drawCosmos },
  { id: "wake", start: 1065, bg: "#e0ad4c", len: 135, entry: [596, 908, 22], exit: [880, 1163, 44], draw: (ctx, t, env, cam, dream) => drawNap(ctx, t + 300, env, { cam, dream, w: { wake: q(ease((t - 20) / 90)), later: true, phone: q(ease((t - 60) / 20), 10) } }) },
  { id: "app", start: 1200, bg: "#2e7a6c", len: app.len, entry: app.entry, draw: (ctx, t, env, cam) => drawApp(ctx, t, env, cam) },
];
const N = 1365, SEAM = 24; // frames each match cut takes (it ends on the scene's first beat + SEAM)
// the dream: off in the room, rising at the turn, full through the dream, settling as she wakes
const dreamAt = (f: number) => (f < 150 ? 0 : f < 225 ? ease((f - 150) / 75) : f < 1065 ? 1 : 1 - ease((f - 1065) / 45));
// a slow creep in every scene so nothing ever sits still; the nap pushes in toward her face
const creep = (s: Scene, t: number): Cam => { if (s.id === "nap") { const k = 1 + 0.12 * ease(t / 225); return { x: 600 * (1 - k), y: 1000 * (1 - k), s: k }; } if (s.id === "app") { const k = 1 + 0.07 * ease(t / s.len); return { x: 540 * (1 - k), y: 1150 * (1 - k), s: k }; } const k = 1 + 0.03 * (t / s.len); return { x: (W / 2) * (1 - k), y: (H / 2) * (1 - k), s: k }; };
const at = (c: Circle, cam: Cam): Circle => [cam.x + c[0] * cam.s, cam.y + c[1] * cam.s, c[2] * cam.s];

const draw = (ctx: Ctx, f: number, env: Env) => {
  const i = SCENES.findIndex((s) => f >= s.start && f < s.start + s.len), B = SCENES[i], t = f - B.start, dream = dreamAt(f);
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0); ctx.fillStyle = "#1e1436"; ctx.fillRect(0, 0, W, H);
  const A = SCENES[i - 1];
  if (!A || !A.exit || !B.entry || t >= SEAM) { B.draw(ctx, t, env, creep(B, t), dream); return; }
  // THE MATCH CUT: A pushes into its exit circle while B grows out of the same circle
  const u = ease(t / SEAM), ta = A.len + t, ca = creep(A, ta), ex = at(A.exit, ca), cb = creep(B, t), en = at(B.entry, cb);
  const rho = Math.exp(lerp(Math.log(ex[2]), Math.log(en[2]), u)), cx = lerp(ex[0], en[0], u), cy = lerp(ex[1], en[1], u);
  const sA = rho / ex[2]; A.draw(ctx, ta, env, { x: cx + (ca.x - ex[0]) * sA, y: cy + (ca.y - ex[1]) * sA, s: ca.s * sA }, dreamAt(A.start + Math.min(ta, A.len - 1)));
  const sB = rho / en[2], camB: Cam = { x: cx + (cb.x - en[0]) * sB, y: cy + (cb.y - en[1]) * sB, s: cb.s * sB };
  ctx.save(); ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0); ctx.beginPath(); ctx.arc(cx, cy, rho * (1 + 46 * u * u), 0, Math.PI * 2); ctx.clip(); if (B.bg) { ctx.fillStyle = B.bg; ctx.fillRect(0, 0, W, H); }
  B.draw(ctx, t, env, camB, dream); ctx.restore();
};

// the one cue table, checked at load: scenes tile the film, every cut on a beat
const beat = (60 * FPS) / BPM;
SCENES.forEach((s, k) => { if (s.start % beat) throw new Error(`gurukul: ${s.id} cuts off the beat`); if (k && SCENES[k - 1].start + SCENES[k - 1].len !== s.start) throw new Error(`gurukul: ${s.id} leaves a gap`); });
if (SCENES[SCENES.length - 1].start + SCENES[SCENES.length - 1].len !== N) throw new Error("gurukul: scenes do not fill the film");

export const gurukul: Film = {
  meta: { title: "DeepKids Gurukul · launch film", W, H, fps: FPS, bpm: BPM, durationFrames: N, kind: "story", poster: 1330, holds: [[1335, N, "the end: Log in tapped, the screen read"]],
    score: { tempo: BPM, form: "intro swell grooveA grooveB breakdown build drop breath outro", grid: true },
    sync: [{ frame: 210, label: "the dream lifts into Kalyani (bar 4)" }, { frame: 997, label: "the peak: the stars, IAm (bar 19)" }, { frame: 1102, label: "she wakes: the drums stop (bar 21)" }, { frame: 1328, label: "Log in tapped (bar 25)" }] },
  assets: { images: {} },
  shots: [{ id: "film", start: 0, end: N, draw }],
  audio: filmScore(score(), FPS, N),
};
