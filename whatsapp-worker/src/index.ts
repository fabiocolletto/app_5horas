export interface Env {
  WHATSAPP_TOKEN: string;
  WHATSAPP_PHONE_NUMBER_ID: string;
  WHATSAPP_VERIFY_TOKEN: string;
}

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');
  return new Response(JSON.stringify(body), { ...init, headers });
}

async function handleSendMessage(request: Request, env: Env) {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method Not Allowed' }, { status: 405 });
  }

  const { WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID } = env;

  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    return jsonResponse(
      { error: 'Missing required WhatsApp secrets.' },
      { status: 500 },
    );
  }

  const payload = await request.json().catch(() => ({}));

  return jsonResponse({
    ok: true,
    received: payload,
    message: 'Placeholder response. Implement WhatsApp Cloud API call here.',
  });
}

async function handleWebhook(request: Request, env: Env) {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method Not Allowed' }, { status: 405 });
  }

  if (!env.WHATSAPP_VERIFY_TOKEN) {
    return jsonResponse(
      { error: 'Missing required WhatsApp verify token.' },
      { status: 500 },
    );
  }

  const payload = await request.json().catch(() => ({}));

  return jsonResponse({
    ok: true,
    received: payload,
    message: 'Placeholder webhook response. Implement processing here.',
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/messages') {
      return handleSendMessage(request, env);
    }

    if (url.pathname === '/webhook') {
      return handleWebhook(request, env);
    }

    return jsonResponse({ error: 'Not Found' }, { status: 404 });
  },
};
