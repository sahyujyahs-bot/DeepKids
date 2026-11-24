// Cloudflare Pages Function — POST /api/save-draft
// Stores an in-progress pre-order form so it can be restored when the
// customer returns via the WhatsApp "Visit website" link, possibly in a
// different browser (e.g. WhatsApp's in-app browser) than the one they
// filled the form in originally.

export async function onRequestPost(context) {
  try {
    const { env, request } = context;
    if (!env.DB) return json({ error: 'Database not configured' }, 500);

    const body = await request.json().catch(() => ({}));
    const { phone, rawPhone, cc, name, address, city, pincode, state } = body;

    if (!phone || !rawPhone) {
      return json({ error: 'Missing required fields' }, 400);
    }

    await env.DB.prepare(
      'INSERT INTO drafts (phone, raw_phone, cc, name, address, city, pincode, state, updated_at) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP) ' +
      'ON CONFLICT(phone) DO UPDATE SET raw_phone=excluded.raw_phone, cc=excluded.cc, name=excluded.name, ' +
      'address=excluded.address, city=excluded.city, pincode=excluded.pincode, state=excluded.state, updated_at=CURRENT_TIMESTAMP'
    ).bind(phone, rawPhone, cc || '+91', name || '', address || '', city || '', pincode || '', state || '').run();

    return json({ success: true });
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
