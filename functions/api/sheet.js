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
    const params = new URLSearchParams();
    params.append('name', data.name || '');
    params.append('whatsapp', data.whatsapp || '');
    params.append('type', data.type || '');

    // Try POST with form data
    const gsResponse = await fetch(SHEET_URL, {
      method: 'POST',
      body: params.toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      redirect: 'follow',
    });

    const gsText = await gsResponse.text();

    // If POST failed, try GET with params
    if (gsResponse.status !== 200) {
      const gsResponse2 = await fetch(SHEET_URL + '?' + params.toString(), {
        redirect: 'follow',
      });
      const gsText2 = await gsResponse2.text();
      return new Response(JSON.stringify({
        result: 'fallback',
        postStatus: gsResponse.status,
        postBody: gsText.substring(0, 200),
        getStatus: gsResponse2.status,
        getBody: gsText2.substring(0, 200),
      }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    return new Response(JSON.stringify({ result: 'ok', status: gsResponse.status }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, stack: err.stack }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
