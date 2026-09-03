const CONTACT_PATH = '/api/contact';
const RECIPIENT_EMAILS = ['charity@curtiscrewict.com', 'stevenm621844@yahoo.com'];
const SENDER_EMAIL = 'website@charitymenefee.com';
const MAX_REQUEST_BYTES = 20000;
const EXPECTED_TURNSTILE_ACTION = 'contact';
const PUSHOVER_ENDPOINT = 'https://api.pushover.net/1/messages.json';
const PUSHOVER_TITLE = 'New website lead';
const PUSHOVER_MESSAGE = 'A new contact form message was received. Check your email for the details.';
const ALLOWED_TURNSTILE_HOSTNAMES = new Set([
  'charity-realtor-site.chalkjhawk79.workers.dev',
  'charitymenefee.com',
]);

const limits = {
  name: { min: 1, max: 100 },
  email: { min: 3, max: 254 },
  phone: { min: 0, max: 40 },
  message: { min: 3, max: 5000 },
  turnstile: { min: 1, max: 2048 },
};

function jsonResponse(body, status = 200, headers = {}) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}

function readText(formData, field) {
  const value = formData.get(field);
  return typeof value === 'string' ? value.trim() : '';
}

function hasUnsafeHeaderCharacters(value) {
  return /[\r\n]/.test(value);
}

function normalizeSubmission(formData) {
  return {
    name: readText(formData, 'name').replace(/\s+/g, ' '),
    email: readText(formData, 'email'),
    phone: readText(formData, 'phone'),
    message: readText(formData, 'message').replace(/\r\n?/g, '\n'),
    website: readText(formData, 'website'),
    turnstileToken: readText(formData, 'cf-turnstile-response'),
  };
}

function validateSubmission(submission) {
  const errors = [];

  if (submission.name.length < limits.name.min || submission.name.length > limits.name.max) errors.push('name');
  if (
    submission.email.length < limits.email.min ||
    submission.email.length > limits.email.max ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email)
  ) errors.push('email');
  if (submission.phone.length > limits.phone.max) errors.push('phone');
  if (submission.message.length < limits.message.min || submission.message.length > limits.message.max) errors.push('message');
  if (submission.turnstileToken.length < limits.turnstile.min || submission.turnstileToken.length > limits.turnstile.max) errors.push('turnstile');
  if (
    hasUnsafeHeaderCharacters(submission.name) ||
    hasUnsafeHeaderCharacters(submission.email) ||
    hasUnsafeHeaderCharacters(submission.phone)
  ) errors.push('headers');

  return errors;
}

async function verifyTurnstile(token, secret, remoteIp, fetchImpl = fetch) {
  if (!secret) return { success: false, unavailable: true };

  const payload = { secret, response: token, idempotency_key: crypto.randomUUID() };
  if (remoteIp) payload.remoteip = remoteIp;

  try {
    const response = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) return { success: false, unavailable: true };
    return await response.json();
  } catch {
    return { success: false, unavailable: true };
  }
}

async function sendPushoverNotification(env, fetchImpl = fetch) {
  const token = typeof env.PUSHOVER_APP_TOKEN === 'string' ? env.PUSHOVER_APP_TOKEN.trim() : '';
  const user = typeof env.PUSHOVER_USER_KEY === 'string' ? env.PUSHOVER_USER_KEY.trim() : '';

  if (!token || !user) {
    console.warn('Pushover notification skipped: configuration unavailable');
    return;
  }

  try {
    const response = await fetchImpl(PUSHOVER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        token,
        user,
        title: PUSHOVER_TITLE,
        message: PUSHOVER_MESSAGE,
      }),
    });

    if (!response.ok) {
      console.error('Pushover notification failed');
      return;
    }

    const result = await response.json();
    if (result?.status !== 1) {
      console.error('Pushover notification failed');
    }
  } catch {
    console.error('Pushover notification failed');
  }
}

function buildEmail(submission, to) {
  return {
    to,
    from: SENDER_EMAIL,
    replyTo: submission.email,
    subject: `Website inquiry from ${submission.name}`,
    text: [
      'New website inquiry',
      '',
      `Name: ${submission.name}`,
      `Email: ${submission.email}`,
      `Phone: ${submission.phone || 'Not provided'}`,
      '',
      'Message:',
      '',
      submission.message,
    ].join('\n'),
  };
}

export async function handleRequest(request, env, dependencies = {}, ctx) {
  const url = new URL(request.url);

  if (url.pathname !== CONTACT_PATH) {
    if (url.pathname.startsWith('/api/')) return jsonResponse({ success: false }, 404);
    return env.ASSETS?.fetch(request) ?? new Response('Not found', { status: 404 });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ success: false }, 405, { Allow: 'POST' });
  }

  const requestLength = Number(request.headers.get('Content-Length') || 0);
  if (requestLength > MAX_REQUEST_BYTES) {
    return jsonResponse({ success: false, error: 'invalid' }, 400);
  }

  const contentType = request.headers.get('Content-Type') || '';
  if (!contentType.includes('multipart/form-data') && !contentType.includes('application/x-www-form-urlencoded')) {
    return jsonResponse({ success: false, error: 'invalid' }, 400);
  }

  let formData;
  try {
    const requestBody = await request.arrayBuffer();
    if (requestBody.byteLength > MAX_REQUEST_BYTES) {
      return jsonResponse({ success: false, error: 'invalid' }, 400);
    }

    formData = await new Response(requestBody, {
      headers: { 'Content-Type': contentType },
    }).formData();
  } catch {
    return jsonResponse({ success: false, error: 'invalid' }, 400);
  }

  const submission = normalizeSubmission(formData);

  if (submission.website) {
    return jsonResponse({ success: true });
  }

  const validationErrors = validateSubmission(submission);
  if (validationErrors.length > 0) {
    const error = validationErrors.includes('turnstile') ? 'verification' : 'invalid';
    return jsonResponse({ success: false, error }, 400);
  }

  const turnstileVerifier = dependencies.verifyTurnstile ?? verifyTurnstile;
  const turnstileResult = await turnstileVerifier(
    submission.turnstileToken,
    env.TURNSTILE_SECRET,
    request.headers.get('CF-Connecting-IP'),
  );

  if (!turnstileResult.success) {
    if (turnstileResult.unavailable) {
      console.error('Contact form Turnstile service error');
      return jsonResponse({ success: false, error: 'server' }, 500);
    }

    return jsonResponse({ success: false, error: 'verification' }, 403);
  }

  if (turnstileResult.action !== EXPECTED_TURNSTILE_ACTION) {
    console.warn('Contact form Turnstile action mismatch');
    return jsonResponse({ success: false, error: 'verification' }, 403);
  }

  if (!ALLOWED_TURNSTILE_HOSTNAMES.has(turnstileResult.hostname)) {
    console.warn('Contact form Turnstile hostname mismatch');
    return jsonResponse({ success: false, error: 'verification' }, 403);
  }

  if (!env.EMAIL?.send) {
    console.error('Contact form email binding unavailable');
    return jsonResponse({ success: false, error: 'server' }, 500);
  }

  try {
    await Promise.all(RECIPIENT_EMAILS.map((to) => env.EMAIL.send(buildEmail(submission, to))));
  } catch {
    console.error('Contact form email delivery error');
    return jsonResponse({ success: false, error: 'server' }, 500);
  }

  const pushoverNotifier = dependencies.sendPushoverNotification ?? sendPushoverNotification;
  const pushoverPromise = Promise.resolve()
    .then(() => pushoverNotifier(env, dependencies.pushoverFetch))
    .catch(() => console.error('Pushover notification failed'));
  let pushoverScheduled = false;

  if (ctx?.waitUntil) {
    try {
      ctx.waitUntil(pushoverPromise);
      pushoverScheduled = true;
    } catch {
      console.error('Pushover notification failed');
    }
  }

  if (!pushoverScheduled) {
    await pushoverPromise;
  }

  return jsonResponse({ success: true });
}

export default {
  fetch(request, env, ctx) {
    return handleRequest(request, env, {}, ctx);
  },
};

export const contactConfig = {
  path: CONTACT_PATH,
  recipients: RECIPIENT_EMAILS,
  sender: SENDER_EMAIL,
  turnstile: {
    action: EXPECTED_TURNSTILE_ACTION,
    allowedHostnames: [...ALLOWED_TURNSTILE_HOSTNAMES],
  },
  limits,
};
