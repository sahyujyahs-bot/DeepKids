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
        language: { code: 'en' },
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

    return json({ success: true, messageId: result.messages && result.messages[0] && result.messages[0].id });
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
