import { type Ctx, type Env, type P } from "./core";
import { clamp, lerp, mix } from "./gallery";
import { ammaHead } from "./cast";
import { camSet, drawPlate, ell, limb, plate, sm, type Cam } from "./gouache";

// THE APP: she has woken up inspired. Her phone fills the frame, her smiling face above it. The
// screen is drawn in the app's own look (app/content/DESIGN.md): the Night band with hand-drawn
// stars, the cool notebook page with faint blue rules and the red margin line, ink-indigo type,
// peacock ticks (no strike-through). One by one the ticks land; she taps "Log in" (margin red).
// The features are the app's own (app/content/SPEC.md, the intro slides, the js modules).
export const FEATURES = [
  "Today's plan, ready each morning",
  "Plans around classes and outings",
  "Follows NCERT, Cambridge or NIOS",
  "Or learn deep, topic by topic",
  "Real experiments with kitchen things",
  "Worksheets at three levels",
  "Read aloud, so kids learn alone",
];
const T = { ink: "#1F2440", paper: "#FCFCF8", rule: "#DCE0EA", red: "#D7372B", turmeric: "#E8A317", peacock: "#0F6E6B", night: "#1E1436", muted: "#646985" };
const SC = { x0: 176, y0: 640, x1: 904, y1: 1850 };   // the screen
export const app = { len: 165, entry: [540, 1240, 60] as [number, number, number], tickAt: (i: number) => 18 + i * 11, tapAt: 128 };
const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const rowY = (i: number) => 965 + i * 96;

export const drawApp = (ctx: Ctx, t: number, env: Env, cam: Cam = { x: 0, y: 0, s: 1 }) => {
  const pl = plate(), { S, L } = pl;
  // the room behind, soft: her saree, the table, the window light
  S([[-10, -10], [1090, -10], [1090, 1930], [-10, 1930]], "#2e7a6c"); S([[-10, 1500], [1090, 1480], [1090, 1930], [-10, 1930]], "#7c3d21");
  S(sm([[-10, 520], [300, 460], [780, 470], [1090, 540], [1090, 700], [-10, 700]], true, 3), "#22564f");
  // her face, looking down at the phone, smiling; a strand loose from the bun
  const br = Math.sin(t * 0.16) * 5;
  ammaHead(pl, 540, 300 + br, 2.9, t > 20 ? "smile" : "calm", 0.08 + Math.sin(t * 0.05) * 0.03);
  S(sm([[470, 520], [610, 520], [620, 600], [460, 600]], true, 2), "#8c5434");                   // the neck
  // the phone in her two hands
  S(sm([[150, 610], [930, 610], [936, 1880], [144, 1880]], true, 2), "#1b1a22");
  S([[SC.x0, SC.y0], [SC.x1, SC.y0], [SC.x1, SC.y1], [SC.x0, SC.y1]], T.paper);
  S([[SC.x0, SC.y0], [SC.x1, SC.y0], [SC.x1, 900], [SC.x0, 900]], T.night);
  for (let i = 0; i < 14; i++) { const x = SC.x0 + 30 + ((i * 197) % 700), y = SC.y0 + 30 + ((i * 89) % 220), r = 4 + 5 * (0.5 + 0.5 * Math.sin(t * 0.25 + i * 1.7)); L([[x - r, y], [x + r, y]], 1.6, "#f6ecd2"); L([[x, y - r], [x, y + r]], 1.6, "#f6ecd2"); }
  L([[250, 900], [250, SC.y1]], 2.2, T.red);
  for (let i = 0; i < 8; i++) L([[SC.x0, rowY(i) + 48], [SC.x1, rowY(i) + 48]], 1.4, T.rule);
  // the Log in button, pressed when her thumb lands
  const tap = ease((t - app.tapAt) / 6) * (1 - ease((t - app.tapAt - 10) / 8)), by = 1690;
  S(sm([[300, by], [780, by], [790, by + 110], [290, by + 110]], true, 2), mix(T.red, "#8f2017", tap * 0.5));
  // hands: fingers round the phone's edges, the right thumb coming in to tap
  const hand = (x: number, y: number, dir: number) => { const k = limb([[x, y + 140], [x + dir * 6, y + 60], [x + dir * 2, y]], [34, 30, 24], 4); S(k.poly, "#b8774a"); for (let i = 0; i < 3; i++) S(ell(x + dir * 22, y + 20 + i * 44, 16, 22), "#a8683f"); };
  hand(140, 1300, 1); hand(940, 1360, -1);
  // ticks, peacock, drawn as a pen does: down-stroke then the long up-stroke
  FEATURES.forEach((_, i) => { const q = clamp((t - app.tickAt(i)) / 8); if (q <= 0) return; const y = rowY(i) + 8, a: P = [204, y], b: P = [218, y + 16], c: P = [244, y - 18]; const pts: P[] = q < 0.35 ? [a, [lerp(a[0], b[0], q / 0.35), lerp(a[1], b[1], q / 0.35)]] : [a, b, [lerp(b[0], c[0], (q - 0.35) / 0.65), lerp(b[1], c[1], (q - 0.35) / 0.65)]]; L(pts, 5, T.peacock); });
  drawPlate(ctx, env, pl, "app", { f: t, cam, dream: 0.001 });
  // type: set after the paint, on the screen only
  ctx.save(); camSet(ctx, env, cam); ctx.textBaseline = "middle";
  ctx.fillStyle = "#f6ecd2"; ctx.font = `700 64px Georgia, "Times New Roman", serif`; ctx.fillText("DeepKids Gurukul", SC.x0 + 40, 735);
  ctx.font = `400 30px "Helvetica Neue", Arial, sans-serif`; ctx.fillStyle = "#cfc6ea"; ctx.fillText("Homeschooling for Indian families", SC.x0 + 42, 812);
  ctx.font = `500 33px "Helvetica Neue", Arial, sans-serif`;
  FEATURES.forEach((f, i) => { ctx.fillStyle = t >= app.tickAt(i) ? T.ink : mix(T.ink, T.paper, 0.45); ctx.fillText(f, 270, rowY(i) + 8); });
  ctx.fillStyle = "#ffffff"; ctx.font = `600 46px "Helvetica Neue", Arial, sans-serif`; ctx.textAlign = "center"; ctx.fillText("Log in", 540, by + 56); ctx.textAlign = "left";
  if (t > app.tapAt) { const k = ease((t - app.tapAt) / 18); ctx.strokeStyle = `rgba(255,255,255,${0.7 * (1 - k)})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(560, by + 55, 20 + k * 140, 0, Math.PI * 2); ctx.stroke(); }
  ctx.restore();
  // her thumb comes in over the screen and taps
  const tp = ease((t - 100) / 26), thumbTip: P = [lerp(1000, 560, tp), lerp(1900, by + 60, tp)];
  if (t > 96) { const p2 = plate(); p2.S(limb([[1100, 2050], [lerp(1050, 760, tp), lerp(2000, 1880, tp)], thumbTip], [60, 46, 34], 5).poly, "#bb7a4b"); p2.S(ell(thumbTip[0] - 6, thumbTip[1] - 18, 20, 14, -0.6), "#e2b18f"); p2.L([[thumbTip[0] - 22, thumbTip[1] - 6], [thumbTip[0] + 10, thumbTip[1] - 30]], 1.4); drawPlate(ctx, env, p2, "thumb", { f: t, cam }); }
};
