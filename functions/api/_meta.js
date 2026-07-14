// Meta Conversions API helper — sends server-side events to the DeepKids
// pixel so conversions survive iOS privacy limits and ad blockers.
//
// Setup: create an access token in Meta Events Manager (Data sources →
// your pixel → Settings → Conversions API → Generate access token) and
// add it as an encrypted environment variable META_CAPI_TOKEN in the
// Cloudflare Pages project. Without the token this module is a no-op,
// so payments are never affected. Optional: set META_CAPI_TEST_CODE to
// a test event code while verifying in Events Manager's Test events tab.
//
// Deduplication: the browser pixel fires the same events with the same
// event_id (see index.html), so Meta keeps exactly one copy whichever
// path delivers first.

const PIXEL_ID = '1960497127528559';

export async function sendMetaEvent(context, event) {
  try {
    const { env, request } = context;
    const token = env.META_CAPI_TOKEN;
    if (!token) return;

    const user_data = {};
    const ip = request.headers.get('CF-Connecting-IP');
    const ua = request.headers.get('User-Agent');
    if (ip) user_data.client_ip_address = ip;
    if (ua) user_data.client_user_agent = ua;

    // _fbp/_fbc cookies ride along on same-origin /api/ requests and
    // dramatically improve Meta's event match quality.
    const cookies = request.headers.get('Cookie') || '';
    const fbp = readCookie(cookies, '_fbp');
    const fbc = readCookie(cookies, '_fbc');
    if (fbp) user_data.fbp = fbp;
    if (fbc) user_data.fbc = fbc;

    if (event.phone) {
      const digits = String(event.phone).replace(/\D/g, '');
      if (digits.length >= 10) user_data.ph = [await sha256Hex(digits)];
    }

    const payload = {
      data: [{
        event_name: event.name,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: request.headers.get('Referer') || 'https://deepkids.in/',
        event_id: event.id || undefined,
        user_data,
        custom_data: {
          currency: 'INR',
          value: event.value != null ? event.value : 2499,
          content_name: 'EscapeGravity'
        }
      }]
    };
    if (env.META_CAPI_TEST_CODE) payload.test_event_code = env.META_CAPI_TEST_CODE;

    const res = await fetch(
      'https://graph.facebook.com/v21.0/' + PIXEL_ID + '/events?access_token=' + encodeURIComponent(token),
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
    );
    // Log failures for debugging (visible in Pages Functions logs) but
    // never throw — CAPI must not interfere with the payment flow.
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.log('meta capi error', res.status, text.slice(0, 300));
    }
  } catch (e) {
    console.log('meta capi exception', String(e));
  }
}

function readCookie(cookieHeader, name) {
  const m = cookieHeader.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
  return m ? m[1] : null;
}

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}
