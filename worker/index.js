const CONTACT_PATH = '/api/contact';
const RECIPIENT_EMAIL = 'stevenm621844@yahoo.com';
const SENDER_EMAIL = 'website@charitymenefee.com';
const MAX_REQUEST_BYTES = 20000;

const limits = {
  name: { min: 1, max: 100 },
  email: { min: 3, max: 254 },
  phone: { min: 0, max: 40 },
  message: { min: 10, max: 5000 },
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

function buildEmail(submission) {
  return {
    to: RECIPIENT_EMAIL,
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

export async function handleRequest(request, env, dependencies = {}) {
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

  if (!env.EMAIL?.send) {
    console.error('Contact form email binding unavailable');
    return jsonResponse({ success: false, error: 'server' }, 500);
  }

  try {
    await env.EMAIL.send(buildEmail(submission));
    return jsonResponse({ success: true });
  } catch {
    console.error('Contact form email delivery error');
    return jsonResponse({ success: false, error: 'server' }, 500);
  }
}

export default {
  fetch(request, env) {
    return handleRequest(request, env);
  },
};

export const contactConfig = {
  path: CONTACT_PATH,
  recipient: RECIPIENT_EMAIL,
  sender: SENDER_EMAIL,
  limits,
};
