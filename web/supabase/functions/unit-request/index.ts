// DeepKids: topics families searched for that DeepKids has no lesson on, and lessons they ask us to write.
// The app sends { action, topic, subj?, level?, lesson? } where action is:
//   "searched"  the family searched and found nothing (recorded even if they do nothing else)
//   "mini"      a quick lesson was written for them (saved with the row)
//   "request"   they asked for the full lesson: the founder is emailed at once and these are written first
//   "mine"      their own rows, so the app can say "your lesson is ready"
// One row per family and topic in public.topic_gaps; status only moves forward: searched -> mini -> requested -> ready.
// Secrets (Supabase dashboard -> Edge Functions -> Secrets): FOUNDER_EMAIL, where the "new request" email goes. The email is sent
// with formsubmit.co, the same free service the DeepKids shop's order form uses, so no API key is needed.
// Optional: DAILY_REQUESTS (default 5 full-lesson requests per family a day), ALLOWED_ORIGINS
import { createClient } from "npm:@supabase/supabase-js@2.118.0";

const DAILY_REQUESTS = Number(Deno.env.get("DAILY_REQUESTS") ?? "5");
const ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "https://app.deepkids.in,https://deepkids.in,http://localhost:8788").split(",").map((s) => s.trim());
const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const RANK: Record<string, number> = { searched: 0, mini: 1, requested: 2, ready: 3 };

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
const keyOf = (t: string) => t.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim().slice(0, 120);

async function emailFounder(subject: string, message: string): Promise<boolean> {
  const to = Deno.env.get("FOUNDER_EMAIL");
  if (!to) return false;
  try {
    const r = await fetch("https://formsubmit.co/ajax/" + encodeURIComponent(to), {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ _subject: subject, _template: "box", message }),
    });
    return r.ok;
  } catch { return false; }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(req) });
  if (req.method !== "POST") return reply(req, 405, { code: "bad_request", message: "POST only" });
  const jwt = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const { data: who } = await admin.auth.getUser(jwt);
  const user = who?.user;
  if (!user) return reply(req, 401, { code: "not_granted", message: "Please sign in again." });
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return reply(req, 400, { code: "bad_request", message: "Bad request" }); }
  const action = String(b.action ?? "");

  if (action === "mine") {
    const { data, error } = await admin.from("topic_gaps").select("id,topic,status,unit_id,first_seen,ready_at").eq("user_id", user.id).order("last_seen", { ascending: false }).limit(60);
    if (error) return reply(req, 500, { code: "db_error", message: error.message });
    return reply(req, 200, { requests: data ?? [] });
  }
  if (!["searched", "mini", "request"].includes(action)) return reply(req, 400, { code: "bad_request", message: "Unknown action" });

  const topic = String(b.topic ?? "").trim().slice(0, 120), topic_key = keyOf(topic);
  if (!topic_key) return reply(req, 400, { code: "bad_request", message: "What should the lesson be about?" });
  const want = action === "request" ? "requested" : action === "mini" ? "mini" : "searched";

  if (want === "requested") {
    const since = new Date(Date.now() - 864e5).toISOString();
    const { count } = await admin.from("topic_gaps").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("requested_at", since);
    if ((count ?? 0) >= DAILY_REQUESTS) return reply(req, 429, { code: "rate_limited", message: "You have asked for a few lessons today. Please try again tomorrow." });
  }
  const { data: old } = await admin.from("topic_gaps").select("id,status,searches,lesson").eq("user_id", user.id).eq("topic_key", topic_key).maybeSingle();
  const now = new Date().toISOString();
  const status = old && RANK[old.status] > RANK[want] ? old.status : want;
  const row: Record<string, unknown> = {
    user_id: user.id, topic, topic_key, status, last_seen: now,
    searches: (old?.searches ?? 0) + (action === "searched" ? 1 : old ? 0 : 1),
    subj: b.subj ? String(b.subj).slice(0, 8) : undefined,
    level: Number.isFinite(Number(b.level)) ? Number(b.level) : undefined,
    lesson: b.lesson ?? old?.lesson ?? null,
  };
  if (want === "requested") row.requested_at = now;
  const { data: saved, error } = await admin.from("topic_gaps").upsert(row, { onConflict: "user_id,topic_key" }).select("id").single();
  if (error) return reply(req, 500, { code: "db_error", message: error.message });
  let emailed = false;
  if (want === "requested" && old?.status !== "requested")
    emailed = await emailFounder(
      `New lesson request: ${topic}`,
      `A family asked DeepKids to write a lesson.\n\nTopic: ${topic}\nFrom: ${user.email ?? user.id}\nRow id: ${saved.id}\n${row.lesson ? "\nThey were shown a quick lesson first (saved with the request).\n" : ""}\nTell Claude, who writes it, pushes it to the app for everyone, and marks it ready so the family is told.`,
    );
  return reply(req, 200, { ok: true, id: saved.id, emailed });
});
