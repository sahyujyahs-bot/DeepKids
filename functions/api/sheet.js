export async function onRequest(context) {
  const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwkytwlYEXbZDMYBOihp_xO5z9-NqwYS-3ucdypdJpn_eKnKmjadFM7-Id2Nua6MsB4/exec';

  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    const data = await context.request.json();
    const params = new URLSearchParams({
      name: data.name || '',
      whatsapp: data.whatsapp || '',
      type: data.type || '',
    });

    await fetch(SHEET_URL + '?' + params.toString(), {
      method: 'GET',
      redirect: 'follow',
    });

    return new Response(JSON.stringify({ result: 'ok' }), {
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
