// Cloudflare Pages Function — GET /api/whatsapp-messages
// Returns all stored messages, newest first, for the /inbox page to render.

export async function onRequestGet(context) {
  const { env } = context;
  if (!env.DB) {
    return json({ error: 'Database not configured' }, 500);
  }
  try {
    const result = await env.DB.prepare(
      'SELECT id, phone, direction, body, template, status, created_at FROM messages ORDER BY created_at ASC'
    ).all();
    return json({ messages: result.results || [] });
  } catch (err) {
    return json({ error: 'Unexpected server error', details: String(err) }, 500);
  }
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

