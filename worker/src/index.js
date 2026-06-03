const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://just-graphics.art',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
    }

    try {
      const data = await request.json();

      if (data.event === 'WhatsAppClick') {
        const capiResult = await sendToMetaCAPI(env, request, {
          eventName: 'Contact',
          source: data.source || 'whatsapp_button',
        });
        return Response.json({ ok: true, capi: 'sent' }, { headers: CORS_HEADERS });
      }

      const { name, phone, car, livery, source } = data;

      if (!name || !phone) {
        return Response.json({ ok: false, error: 'Name and phone required' }, { status: 400, headers: CORS_HEADERS });
      }

      const title = livery && livery !== 'Not specified'
        ? `Livery enquiry — ${car || 'No car'}`
        : source === 'page_lead_form'
          ? `Callback — ${car || 'No car specified'}`
          : `Lead — ${car || 'No car'}`;

      const comments = [
        `Car: ${car || 'Not specified'}`,
        livery && livery !== 'Not specified' ? `Livery: Racing Livery #${livery}` : null,
        `Source: ${source || 'website'}`,
      ].filter(Boolean).join('\n');

      const [bitrixResult, capiResult] = await Promise.allSettled([
        sendToBitrix(env, { title, name, phone, comments }),
        sendToMetaCAPI(env, request, { eventName: 'Lead', name, phone, source }),
      ]);

      return Response.json({
        ok: true,
        bitrix: bitrixResult.status === 'fulfilled' ? 'sent' : 'error',
        capi: capiResult.status === 'fulfilled' ? 'sent' : 'error',
      }, { headers: CORS_HEADERS });

    } catch (err) {
      return Response.json({ ok: false, error: 'Invalid request' }, { status: 400, headers: CORS_HEADERS });
    }
  }
};

async function sendToBitrix(env, { title, name, phone, comments }) {
  const resp = await fetch(env.BITRIX_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fields: {
        TITLE: title,
        NAME: name,
        PHONE: [{ VALUE: phone, VALUE_TYPE: 'WORK' }],
        COMMENTS: comments,
        SOURCE_ID: 'WEB',
      }
    }),
  });
  return resp.json();
}

async function sendToMetaCAPI(env, request, { eventName, name, phone, source }) {
  const userData = {
    client_ip_address: request.headers.get('CF-Connecting-IP'),
    client_user_agent: request.headers.get('User-Agent'),
  };

  if (phone) userData.ph = [await sha256(normalizePhone(phone))];
  if (name) userData.fn = [await sha256(name.trim().toLowerCase())];

  const eventData = {
    event_name: eventName || 'Lead',
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    event_source_url: request.headers.get('Referer') || 'https://just-graphics.art',
    user_data: userData,
    custom_data: {
      lead_source: source || 'website',
    },
  };

  const resp = await fetch(
    `https://graph.facebook.com/v21.0/${env.PIXEL_ID}/events`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [eventData],
        access_token: env.META_CAPI_TOKEN,
      }),
    }
  );
  return resp.json();
}

function normalizePhone(phone) {
  return phone.replace(/[\s\-()]/g, '').toLowerCase();
}

async function sha256(value) {
  const encoded = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', encoded);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
}
