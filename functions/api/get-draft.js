// Cloudflare Pages Function — GET /api/get-draft?phone=...
// Returns the most recently saved in-progress pre-order form for this phone
// number, so the /inbox WhatsApp link can restore it across browsers.

export async function onRequestGet(context) {
  const { env, request } = context;
  if (!env.DB) return json({ error: 'Database not configured' }, 500);

  const url = new URL(request.url);
  const phone = (url.searchParams.get('phone') || '').replace(/[^\d]/g, '');
  if (!phone) return json({ error: 'Missing phone' }, 400);

  try {
    const result = await env.DB.prepare(
      'SELECT raw_phone, cc, name, address, city, pincode, state FROM drafts WHERE raw_phone = ? OR phone LIKE ?'
    ).bind(phone, '%' + phone).first();

    return json({ draft: result || null });
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
