// DeepKids: Claude for the website.
// The app sends { input, images, tier }; this function checks the signed-in parent, applies a daily limit,
// calls Claude with the server's API key, and returns { text, json }.
// Secrets (Supabase dashboard -> Edge Functions -> Secrets): ANTHROPIC_API_KEY
// REQUIRE_PLUS (default "true"): only families with an active row in public.plans can use Claude
// The app asks for a tier; each tier uses the cheapest model that does that job well:
//   quick   (sorting what a parent typed, tagging photos, filing the home shelf)  Claude Haiku 5.5
//   default (questions in a unit, checking work, writing quizzes and topics)      Claude Sonnet 5.5
//   complex (the entrance-test paper)                                              Claude Opus 5.5
// Optional: MODEL_QUICK, MODEL_DEFAULT, MODEL_COMPLEX to change a tier's model, DAILY_CALLS (default 80),
//   ALLOWED_ORIGINS, INVITE_ONLY ("true" to require public.invites)
import Anthropic from "npm:@anthropic-ai/sdk@1.1.0";
import { createClient } from "npm:@supabase/supabase-js@2.118.0";

const MODELS: Record<string, string> = {
  quick: Deno.env.get("MODEL_QUICK") ?? "claude-haiku-5-5",
  default: Deno.env.get("MODEL_DEFAULT") ?? "claude-sonnet-5-5",
  complex: Deno.env.get("MODEL_COMPLEX") ?? "claude-opus-5-5",
};
const DAILY_CALLS = Number(Deno.env.get("DAILY_CALLS") ?? "80");
const ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "https://app.deepkids.in,https://deepkids.in,http://localhost:8788").split(",").map((s) => s.trim());
const INVITE_ONLY = Deno.env.get("INVITE_ONLY") === "true";
const REQUIRE_PLUS = Deno.env.get("REQUIRE_PLUS") !== "false";
const EFFORT: Record<string, "low" | "medium" | "high"> = { quick: "low", default: "medium", complex: "high" };
const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") });
const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

function cors(req: Request) {
  const o = req.headers.get("origin") ?? "";
  return {
    "access-control-allow-origin": ORIGINS.includes(o) ? o : ORIGINS[0],
    "access-control-allow-headers": "authorization, apikey, content-type",
    "access-control-allow-methods": "POST, OPTIONS",
    "vary": "origin",
  };
}
const reply = (req: Request, status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors(req), "content-type": "application/json" } });

// The app's prompts ask for "only JSON"; take the first complete JSON value in the text.
export function extractJson(text: string): unknown {
  const t = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  try { return JSON.parse(t); } catch { /* fall through */ }
  const start = t.search(/[\[{]/);
  if (start < 0) return null;
  const open = t[start], close = open === "{" ? "}" : "]";
  let depth = 0, inStr = false, esc = false;
  for (let i = start; i < t.length; i++) {
    const c = t[i];
    if (inStr) { if (esc) esc = false; else if (c === "\\") esc = true; else if (c === '"') inStr = false; continue; }
    if (c === '"') inStr = true;
    else if (c === open) depth++;
    else if (c === close && --depth === 0) { try { return JSON.parse(t.slice(start, i + 1)); } catch { return null; } }
  }
  return null;
}

type Img = { media_type: string; data: string };
type Turn = { role: "user" | "assistant"; content: string };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors(req) });
  if (req.method !== "POST") return reply(req, 405, { code: "bad_request", message: "POST only" });

  // Who is asking (the platform verifies the JWT before this runs; we still read the user)
  const jwt = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const { data: who } = await admin.auth.getUser(jwt);
  const user = who?.user;
  if (!user) return reply(req, 401, { code: "not_granted", message: "Please sign in again." });
  if (INVITE_ONLY) {
    const { data: inv } = await admin.from("invites").select("email").eq("email", (user.email ?? "").toLowerCase()).maybeSingle();
    if (!inv) return reply(req, 403, { code: "not_granted", message: "DeepKids is invite-only for now." });
  }

  if (REQUIRE_PLUS) {
    const { data: plan } = await admin.from("plans").select("valid_until").eq("user_id", user.id).maybeSingle();
    if (!plan || new Date(plan.valid_until) <= new Date()) return reply(req, 402, { code: "needs_plan", message: "This is part of DeepKids Plus." });
  }

  // Daily limit per family
  const day = new Date().toISOString().slice(0, 10);
  const { data: use } = await admin.from("ai_usage").select("calls,in_tokens,out_tokens").eq("user_id", user.id).eq("day", day).maybeSingle();
  if ((use?.calls ?? 0) >= DAILY_CALLS) return reply(req, 429, { code: "rate_limited", message: "That's a lot for one day. Try again tomorrow." });

  let body: { input?: string | Turn[]; images?: Img[]; tier?: string };
  try { body = await req.json(); } catch { return reply(req, 400, { code: "bad_request", message: "Bad JSON" }); }
  const imgs = (body.images ?? []).slice(0, 8).filter((i) => /^image\/(jpeg|png|webp|gif)$/.test(i.media_type) && typeof i.data === "string");
  const turns: Turn[] = typeof body.input === "string" ? [{ role: "user", content: body.input }] : (body.input ?? []);
  if (!turns.length || turns[turns.length - 1].role !== "user") return reply(req, 400, { code: "bad_request", message: "Nothing to answer" });
  const total = turns.reduce((a, t) => a + String(t.content).length, 0);
  if (total > 60000) return reply(req, 413, { code: "too_large", message: "Message too long" });

  const messages = turns.map((t, i) => {
    const last = i === turns.length - 1;
    if (!last || !imgs.length) return { role: t.role, content: String(t.content) };
    return {
      role: t.role,
      content: [
        ...imgs.map((im) => ({ type: "image" as const, source: { type: "base64" as const, media_type: im.media_type as "image/jpeg", data: im.data } })),
        { type: "text" as const, text: String(t.content) },
      ],
    };
  });
  const tier = body.tier ?? "default",
    model = MODELS[tier] ?? MODELS.default;

  try {
    const stream = anthropic.beta.messages.stream({
      model,
      max_tokens: tier === "complex" ? 32000 : 16000,
      output_config: { effort: EFFORT[tier] ?? "medium" },
      // Sonnet and Opus can hand a refused or overloaded request to a fallback model; Haiku has no fallback
      ...(model.includes("haiku") ? {} : { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" }),
      messages,
    });
    const msg = await stream.finalMessage();
    const inTok = msg.usage?.input_tokens ?? 0, outTok = msg.usage?.output_tokens ?? 0;
    await admin.from("ai_usage").upsert({
      user_id: user.id, day,
      calls: (use?.calls ?? 0) + 1,
      in_tokens: (use?.in_tokens ?? 0) + inTok,
      out_tokens: (use?.out_tokens ?? 0) + outTok,
    });
    if (msg.stop_reason === "refusal") return reply(req, 422, { code: "refused", message: "Claude couldn't help with that one. Try wording it differently." });
    const text = msg.content.filter((b) => b.type === "text").map((b) => (b as { text: string }).text).join("\n").trim();
    return reply(req, 200, { text, json: extractJson(text), truncated: msg.stop_reason === "max_tokens", model: msg.model });
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) return reply(req, 429, { code: "rate_limited", message: "Busy right now. Try again in a minute." });
    if (e instanceof Anthropic.BadRequestError) return reply(req, 400, { code: "bad_request", message: e.message });
    if (e instanceof Anthropic.AuthenticationError) return reply(req, 500, { code: "unavailable", message: "The server's Claude key isn't set up." });
    if (e instanceof Anthropic.APIError) return reply(req, 502, { code: "unavailable", message: "Claude didn't answer. Try again." });
    return reply(req, 500, { code: "unavailable", message: "Something went wrong. Try again." });
  }
});
