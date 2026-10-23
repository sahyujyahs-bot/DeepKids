// DeepKids Plus: prices, Razorpay orders, payment checks, and the Razorpay webhook.
// Secrets (Supabase -> Edge Functions -> Secrets):
//   RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET      from Razorpay Dashboard -> Account & Settings -> API Keys (test keys first)
//   PLUS_PRICES   JSON, e.g. [{"months":1,"inr":199},{"months":12,"inr":1999}]
//   RAZORPAY_WEBHOOK_SECRET   optional, only if you add the webhook (then turn OFF "Enforce JWT verification" for this function)
//   ALLOWED_ORIGINS optional, default https://app.deepkids.in
import { createClient } from "npm:@supabase/supabase-js@2.118.0";

const KEY_ID = Deno.env.get("RAZORPAY_KEY_ID") ?? "";
const KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET") ?? "";
const HOOK_SECRET = Deno.env.get("RAZORPAY_WEBHOOK_SECRET") ?? "";
const ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "https://app.deepkids.in,https://deepkids.in,http://localhost:8788").split(",").map((s) => s.trim());
const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

type Price = { months: number; inr: number };
function prices(): Price[] {
  try {
    const p = JSON.parse(Deno.env.get("PLUS_PRICES") ?? "[]");
    return (Array.isArray(p) ? p : []).filter((x) => Number.isInteger(x.months) && x.months > 0 && x.months <= 24 && Number(x.inr) >= 1);
  } catch { return []; }
}

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

async function hmacHex(secret: string, data: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function same(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

async function currentPlan(userId: string) {
  const { data } = await admin.from("plans").select("valid_until").eq("user_id", userId).maybeSingle();
  return data?.valid_until ?? null;
}

// Mark an order paid once, and extend the family's Plus from today or from its current end date
async function markPaid(orderId: string, paymentId: string) {
  const { data: pay } = await admin.from("payments").select("*").eq("order_id", orderId).maybeSingle();
  if (!pay) return null;
  if (pay.status === "paid") return await currentPlan(pay.user_id);
  const cur = await currentPlan(pay.user_id);
  const from = cur && new Date(cur) > new Date() ? new Date(cur) : new Date();
  const until = new Date(from);
  until.setMonth(until.getMonth() + pay.months);
  await admin.from("payments").update({ status: "paid", payment_id: paymentId, paid_at: new Date().toISOString() }).eq("order_id", orderId).eq("status", "created");
  await admin.from("plans").upsert({ user_id: pay.user_id, plan: "plus", valid_until: until.toISOString(), updated_at: new Date().toISOString() });
  return until.toISOString();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors(req) });
  if (req.method !== "POST") return reply(req, 405, { code: "bad_request" });

  // Razorpay webhook (server to server): verified by its own signature, not by a user's sign-in
  const hookSig = req.headers.get("x-razorpay-signature");
  if (hookSig) {
    const raw = await req.text();
    if (!HOOK_SECRET || !same(await hmacHex(HOOK_SECRET, raw), hookSig)) return reply(req, 401, { code: "bad_signature" });
    const ev = JSON.parse(raw);
    const p = ev?.payload?.payment?.entity;
    if ((ev?.event === "payment.captured" || ev?.event === "order.paid") && p?.order_id) await markPaid(p.order_id, p.id);
    return reply(req, 200, { ok: true });
  }

  const jwt = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const { data: who } = await admin.auth.getUser(jwt);
  const user = who?.user;
  if (!user) return reply(req, 401, { code: "not_granted", message: "Please sign in again." });

  let body: { action?: string; months?: number; razorpay_order_id?: string; razorpay_payment_id?: string; razorpay_signature?: string };
  try { body = await req.json(); } catch { return reply(req, 400, { code: "bad_request" }); }

  if (body.action === "status") {
    return reply(req, 200, { valid_until: await currentPlan(user.id), prices: prices(), payments: !!(KEY_ID && KEY_SECRET && prices().length) });
  }

  if (body.action === "order") {
    if (!KEY_ID || !KEY_SECRET) return reply(req, 503, { code: "unavailable", message: "Payments aren't set up yet." });
    const price = prices().find((p) => p.months === body.months) ?? prices()[0];
    if (!price) return reply(req, 503, { code: "unavailable", message: "No Plus price is set yet." });
    const amount = Math.round(price.inr * 100);
    const r = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: "Basic " + btoa(`${KEY_ID}:${KEY_SECRET}`) },
      body: JSON.stringify({ amount, currency: "INR", receipt: `dk_${user.id.slice(0, 8)}_${Date.now()}`, notes: { user_id: user.id, months: String(price.months), product: "DeepKids Plus" } }),
    });
    const order = await r.json().catch(() => null);
    if (!r.ok || !order?.id) return reply(req, 502, { code: "unavailable", message: "Couldn't start the payment. Try again." });
    await admin.from("payments").insert({ order_id: order.id, user_id: user.id, amount, currency: "INR", months: price.months });
    return reply(req, 200, { key_id: KEY_ID, order_id: order.id, amount, currency: "INR", months: price.months, email: user.email ?? "", name: user.user_metadata?.full_name ?? "" });
  }

  if (body.action === "verify") {
    const { razorpay_order_id: o, razorpay_payment_id: p, razorpay_signature: s } = body;
    if (!o || !p || !s || !KEY_SECRET) return reply(req, 400, { code: "bad_request" });
    const { data: pay } = await admin.from("payments").select("user_id").eq("order_id", o).maybeSingle();
    if (!pay || pay.user_id !== user.id) return reply(req, 404, { code: "not_found" });
    if (!same(await hmacHex(KEY_SECRET, `${o}|${p}`), s)) return reply(req, 400, { code: "bad_signature", message: "We couldn't confirm that payment." });
    return reply(req, 200, { valid_until: await markPaid(o, p) });
  }

  return reply(req, 400, { code: "bad_request" });
});
