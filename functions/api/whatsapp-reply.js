// Cloudflare Pages Function — POST /api/whatsapp-reply
// Sends a free-form text reply (not a template) to a customer who has
// messaged within the last 24 hours, per WhatsApp's customer service
// window rule. Used by the /inbox page.

export async function onRequestPost(context) {
  try {
    const { env, request } = context;
    const accessToken = env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID;

    if (!accessToken || !phoneNumberId) {
      return json({ error: 'WhatsApp credentials not configured' }, 500);
    }

    const body = await request.json().catch(() => ({}));
    const { phone, text } = body;

    if (!phone || !text) {
      return json({ error: 'Missing required fields' }, 400);
    }

    const cleanPhone = phone.replace(/[^\d]/g, '');

    const response = await fetch('https://graph.facebook.com/v25.0/' + phoneNumberId + '/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: cleanPhone,
        type: 'text',
        text: { body: text }
      })
    });

    const result = await response.json().catch(function () { return {}; });

    if (!response.ok) {
      return json({ success: false, error: result.error ? result.error.message : 'HTTP ' + response.status }, response.status);
    }

    const messageId = result.messages && result.messages[0] && result.messages[0].id;

    if (env.DB) {
      try {
        await env.DB.prepare(
          'INSERT INTO messages (phone, direction, body, status, wa_message_id) VALUES (?, ?, ?, ?, ?)'
        ).bind(cleanPhone, 'out', text, 'sent', messageId || null).run();
      } catch (ex) {}
    }

    return json({ success: true, messageId: messageId });
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
