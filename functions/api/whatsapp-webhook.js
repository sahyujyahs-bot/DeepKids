// Cloudflare Pages Function — /api/whatsapp-webhook
// GET: Meta's webhook verification handshake.
// POST: receives incoming WhatsApp messages and delivery status updates,
// stores them in D1 so the /inbox page can display conversation history.

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return new Response('Forbidden', { status: 403 });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json().catch(() => ({}));
    const entries = body.entry || [];

    for (const entry of entries) {
      for (const change of (entry.changes || [])) {
        const value = change.value || {};

        for (const msg of (value.messages || [])) {
          const text = msg.text ? msg.text.body : ('[' + msg.type + ']');
          if (env.DB) {
            await env.DB.prepare(
              'INSERT INTO messages (phone, direction, body, wa_message_id) VALUES (?, ?, ?, ?)'
            ).bind(msg.from, 'in', text, msg.id || null).run().catch(function () {});
          }
        }

        for (const status of (value.statuses || [])) {
          if (env.DB && status.id) {
            await env.DB.prepare(
              'UPDATE messages SET status = ? WHERE wa_message_id = ?'
            ).bind(status.status, status.id).run().catch(function () {});
          }
        }
      }
    }

    return new Response('OK', { status: 200 });
  } catch (err) {
    return new Response('OK', { status: 200 }); // Meta retries on non-200; ack anyway
  }
}
