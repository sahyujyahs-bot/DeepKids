export async function onRequest(context) {
  const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwkytwlYEXbZDMYBOihp_xO5z9-NqwYS-3ucdypdJpn_eKnKmjadFM7-Id2Nua6MsB4/exec';

  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (context.request.method === 'GET') {
    return new Response(JSON.stringify({ status: 'Worker is running' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const data = await context.request.json();

    // Append data as URL query params — NOT as POST body.
    // Google's 302 redirect turns POST→GET and drops the body.
    // Query params survive the redirect because they're in the URL.
    const url = SHEET_URL
      + '?name=' + encodeURIComponent(data.name || '')
      + '&whatsapp=' + encodeURIComponent(data.whatsapp || '')
      + '&type=' + encodeURIComponent(data.type || '');

    // Use GET so the redirect doesn't strip anything
    const gsResponse = await fetch(url, { redirect: 'follow' });
    const gsText = await gsResponse.text();

    return new Response(JSON.stringify({
      result: 'ok',
      gsStatus: gsResponse.status,
      gsResponse: gsText.substring(0, 200)
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
