// Cloudflare Pages Function — POST /api/send-whatsapp
// Sends a pre-approved WhatsApp template message via the Meta Cloud API.
// The access token never reaches the browser — only this server-side
// function holds it (set as a Cloudflare Pages environment secret).

export async function onRequestPost(context) {
  try {
    const { env, request } = context;
    const accessToken = env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID;

    if (!accessToken || !phoneNumberId) {
      return json({ error: 'WhatsApp credentials not configured' }, 500);
    }

    const body = await request.json().catch(() => ({}));
    const { phone, template, bodyParams, buttonParam } = body;

    if (!phone || !template) {
      return json({ error: 'Missing required fields' }, 400);
    }

    const components = [];

    // order_started_new (and any future template with an image header) was
    // created with a media header, which Meta always treats as dynamic —
    // every send must include a header component carrying the image link,
    // or the API rejects the whole message with #132012 even though the
    // body/button params are correctly formatted.
    if (template === 'order_started_new') {
      components.push({
        type: 'header',
        parameters: [{ type: 'image', image: { link: 'https://deepkids.in/spiral-board-display-transparent.png' } }]
      });
    }

    if (Array.isArray(bodyParams) && bodyParams.length) {
      components.push({
        type: 'body',
        parameters: bodyParams.map(function (text) { return { type: 'text', text: String(text) }; })
      });
    }

    if (buttonParam) {
      components.push({
        type: 'button',
        sub_type: 'url',
        index: '0',
        parameters: [{ type: 'text', text: String(buttonParam) }]
      });
    }

    const payload = {
      messaging_product: 'whatsapp',
      to: phone.replace(/[^\d]/g, ''),
      type: 'template',
      template: {
        name: template,
        // hello_world (Meta's built-in test template) only exists under en_US;
        // our own templates were created under plain English (en).
        language: { code: template === 'hello_world' ? 'en_US' : 'en' },
        components: components
      }
    };

    const response = await fetch('https://graph.facebook.com/v25.0/' + phoneNumberId + '/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(function () { return {}; });

    if (!response.ok) {
      return json({ success: false, error: result.error ? result.error.message : 'HTTP ' + response.status }, response.status);
    }

    const messageId = result.messages && result.messages[0] && result.messages[0].id;

    if (env.DB) {
      try {
        await env.DB.prepare(
          'INSERT INTO messages (phone, direction, body, template, status, wa_message_id) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(payload.to, 'out', (bodyParams || []).join(' / '), template, 'sent', messageId || null).run();
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
