export async function onRequest(context) {
  const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwkytwlYEXbZDMYBOihp_xO5z9-NqwYS-3ucdypdJpn_eKnKmjadFM7-Id2Nua6MsB4/exec';

  // Handle CORS preflight
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // GET = health check
  if (context.request.method === 'GET') {
    return new Response(JSON.stringify({ status: 'Worker is running' }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  try {
    const data = await context.request.json();
    const params = new URLSearchParams({
      name: data.name || '',
      whatsapp: data.whatsapp || '',
      type: data.type || '',
    });

    const gsResponse = await fetch(SHEET_URL + '?' + params.toString(), {
      method: 'GET',
      redirect: 'follow',
    });

    const gsText = await gsResponse.text();

    return new Response(JSON.stringify({ result: 'ok', gsStatus: gsResponse.status, gsBody: gsText }), {
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
