import test from 'node:test';
import assert from 'node:assert/strict';
import { contactConfig, handleRequest } from '../worker/index.js';

const validFields = {
  name: 'Taylor Example',
  email: 'taylor@example.com',
  phone: '316-555-0100',
  message: 'I would like to talk about buying a home.',
  website: '',
  'cf-turnstile-response': 'valid-test-token',
};

function contactRequest(fields = validFields, method = 'POST') {
  if (method !== 'POST') return new Request('https://example.com/api/contact', { method });

  const body = new FormData();
  for (const [key, value] of Object.entries(fields)) body.set(key, value);
  return new Request('https://example.com/api/contact', { method, body });
}

function testEnv(send = async () => ({ messageId: 'test-message' }), pushover = {}) {
  return { TURNSTILE_SECRET: 'test-only', EMAIL: { send }, ...pushover };
}

function backgroundContext() {
  const tasks = [];
  return {
    tasks,
    ctx: {
      waitUntil(task) {
        tasks.push(Promise.resolve(task));
      },
    },
    async drain() {
      await Promise.all(tasks);
    },
  };
}

const passesTurnstile = async () => ({
  success: true,
  action: contactConfig.turnstile.action,
  hostname: 'charity-realtor-site.chalkjhawk79.workers.dev',
});

test('accepts a valid submission and sends only to the fixed recipient', async () => {
  let sentMessage;
  const response = await handleRequest(
    contactRequest(),
    testEnv(async (message) => {
      sentMessage = message;
      return { messageId: 'test-message' };
    }),
    { verifyTurnstile: passesTurnstile },
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(contactConfig.recipient, 'stevenm621844@yahoo.com');
  assert.equal(sentMessage.to, contactConfig.recipient);
  assert.equal(sentMessage.from, contactConfig.sender);
  assert.equal(sentMessage.replyTo, validFields.email);
  assert.match(sentMessage.subject, /Taylor Example/);
  assert.match(sentMessage.text, /316-555-0100/);
});

test('schedules a generic Pushover notification after successful email delivery', async () => {
  let emailSent = false;
  let pushoverRequests = 0;
  let pushoverRequest;
  let resolvePushover;
  const pushoverResponse = new Promise((resolve) => {
    resolvePushover = resolve;
  });
  const background = backgroundContext();
  const response = await handleRequest(
    contactRequest(),
    testEnv(
      async () => {
        emailSent = true;
        return { messageId: 'test-message' };
      },
      {
        PUSHOVER_APP_TOKEN: 'test-app-token',
        PUSHOVER_USER_KEY: 'test-user-key',
      },
    ),
    {
      verifyTurnstile: passesTurnstile,
      pushoverFetch: async (url, options) => {
        assert.equal(emailSent, true);
        pushoverRequests += 1;
        pushoverRequest = { url, options };
        return pushoverResponse;
      },
    },
    background.ctx,
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(background.tasks.length, 1);
  assert.equal(pushoverRequests, 1);
  assert.equal(pushoverRequest.url, 'https://api.pushover.net/1/messages.json');
  assert.equal(pushoverRequest.options.method, 'POST');
  assert.equal(pushoverRequest.options.headers['Content-Type'], 'application/x-www-form-urlencoded');

  const payload = Object.fromEntries(pushoverRequest.options.body);
  assert.deepEqual(payload, {
    token: 'test-app-token',
    user: 'test-user-key',
    title: 'New website lead',
    message: 'A new contact form message was received. Check your email for the details.',
  });

  const pushoverValues = Object.values(payload).join('\n');
  for (const field of ['name', 'email', 'phone', 'message']) {
    assert.equal(pushoverValues.includes(validFields[field]), false);
  }

  resolvePushover(Response.json({ status: 1 }));
  await background.drain();
});

test('rejects a non-POST request', async () => {
  const response = await handleRequest(contactRequest({}, 'GET'), testEnv());
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('Allow'), 'POST');
});

test('rejects missing required fields', async () => {
  const response = await handleRequest(contactRequest({}), testEnv(), { verifyTurnstile: passesTurnstile });
  assert.equal(response.status, 400);
});

test('rejects a malformed email', async () => {
  const response = await handleRequest(
    contactRequest({ ...validFields, email: 'not-an-email' }),
    testEnv(),
    { verifyTurnstile: passesTurnstile },
  );
  assert.equal(response.status, 400);
});

test('accepts a message at the three-character minimum', async () => {
  const response = await handleRequest(
    contactRequest({ ...validFields, message: 'Hi!' }),
    testEnv(),
    { verifyTurnstile: passesTurnstile },
  );
  assert.equal(contactConfig.limits.message.min, 3);
  assert.equal(response.status, 200);
});

test('rejects a message shorter than three characters', async () => {
  const response = await handleRequest(
    contactRequest({ ...validFields, message: 'Hi' }),
    testEnv(),
    { verifyTurnstile: passesTurnstile },
  );
  assert.equal(response.status, 400);
});

test('rejects oversized input', async () => {
  const response = await handleRequest(
    contactRequest({ ...validFields, message: 'x'.repeat(contactConfig.limits.message.max + 1) }),
    testEnv(),
    { verifyTurnstile: passesTurnstile },
  );
  assert.equal(response.status, 400);
});

test('safely accepts a populated honeypot without sending email', async () => {
  let sent = false;
  let verified = false;
  let pushoverAttempted = false;
  const background = backgroundContext();
  const response = await handleRequest(
    contactRequest({ ...validFields, website: 'https://spam.example' }),
    testEnv(async () => {
      sent = true;
    }),
    {
      verifyTurnstile: async () => {
        verified = true;
        return passesTurnstile();
      },
      pushoverFetch: async () => {
        pushoverAttempted = true;
        return Response.json({ status: 1 });
      },
    },
    background.ctx,
  );
  assert.equal(response.status, 200);
  assert.equal(sent, false);
  assert.equal(verified, false);
  assert.equal(pushoverAttempted, false);
  assert.equal(background.tasks.length, 0);
});

test('rejects a missing Turnstile token', async () => {
  const fields = { ...validFields };
  delete fields['cf-turnstile-response'];
  const response = await handleRequest(contactRequest(fields), testEnv(), { verifyTurnstile: passesTurnstile });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error, 'verification');
});

test('rejects an invalid Turnstile token without sending email', async () => {
  let sent = false;
  let pushoverAttempted = false;
  const background = backgroundContext();
  const response = await handleRequest(
    contactRequest(),
    testEnv(async () => {
      sent = true;
    }),
    {
      verifyTurnstile: async () => ({ success: false }),
      pushoverFetch: async () => {
        pushoverAttempted = true;
        return Response.json({ status: 1 });
      },
    },
    background.ctx,
  );
  assert.equal(response.status, 403);
  assert.equal(sent, false);
  assert.equal(pushoverAttempted, false);
  assert.equal(background.tasks.length, 0);
});

test('accepts the approved production Turnstile hostname', async () => {
  let sent = false;
  const response = await handleRequest(
    contactRequest(),
    testEnv(async () => {
      sent = true;
      return { messageId: 'test-message' };
    }),
    { verifyTurnstile: async () => ({
      success: true,
      action: contactConfig.turnstile.action,
      hostname: 'charitymenefee.com',
    }) },
  );

  assert.equal(response.status, 200);
  assert.equal(sent, true);
});

for (const [name, result] of [
  ['an incorrect action', { success: true, action: 'login', hostname: 'charitymenefee.com' }],
  ['a missing action', { success: true, hostname: 'charitymenefee.com' }],
  ['an incorrect hostname', { success: true, action: 'contact', hostname: 'example.com' }],
  ['a missing hostname', { success: true, action: 'contact' }],
]) {
  test(`rejects ${name} without sending email`, async () => {
    let sent = false;
    const response = await handleRequest(
      contactRequest(),
      testEnv(async () => {
        sent = true;
      }),
      { verifyTurnstile: async () => result },
    );

    assert.equal(response.status, 403);
    assert.deepEqual(await response.json(), { success: false, error: 'verification' });
    assert.equal(sent, false);
  });
}

test('returns a server error when Turnstile verification is unavailable', async () => {
  const response = await handleRequest(
    contactRequest(),
    testEnv(),
    { verifyTurnstile: async () => ({ success: false, unavailable: true }) },
  );
  assert.equal(response.status, 500);
});

test('returns a server error when email delivery fails', async () => {
  let pushoverAttempted = false;
  const background = backgroundContext();
  const response = await handleRequest(
    contactRequest(),
    testEnv(
      async () => {
        throw new Error('simulated email failure');
      },
      {
        PUSHOVER_APP_TOKEN: 'test-app-token',
        PUSHOVER_USER_KEY: 'test-user-key',
      },
    ),
    {
      verifyTurnstile: passesTurnstile,
      pushoverFetch: async () => {
        pushoverAttempted = true;
        return Response.json({ status: 1 });
      },
    },
    background.ctx,
  );
  assert.equal(response.status, 500);
  assert.equal(pushoverAttempted, false);
  assert.equal(background.tasks.length, 0);
});

for (const [name, pushoverFetch] of [
  ['a network error', async () => { throw new Error('simulated Pushover network error'); }],
  ['a non-success HTTP response', async () => new Response('', { status: 500 })],
  ['a malformed JSON response', async () => new Response('not-json', { status: 200 })],
  ['a rejected API response', async () => Response.json({ status: 0 })],
]) {
  test(`keeps the contact submission successful after ${name}`, async () => {
    let emailSent = false;
    const background = backgroundContext();
    const response = await handleRequest(
      contactRequest(),
      testEnv(
        async () => {
          emailSent = true;
          return { messageId: 'test-message' };
        },
        {
          PUSHOVER_APP_TOKEN: 'test-app-token',
          PUSHOVER_USER_KEY: 'test-user-key',
        },
      ),
      { verifyTurnstile: passesTurnstile, pushoverFetch },
      background.ctx,
    );

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true });
    assert.equal(emailSent, true);
    assert.equal(background.tasks.length, 1);
    await background.drain();
  });
}

for (const [name, configuration] of [
  ['the app token is missing', { PUSHOVER_USER_KEY: 'test-user-key' }],
  ['the user key is missing', { PUSHOVER_APP_TOKEN: 'test-app-token' }],
  ['both credentials are missing', {}],
]) {
  test(`skips Pushover without failing email when ${name}`, async () => {
    let emailSent = false;
    let pushoverAttempted = false;
    const background = backgroundContext();
    const response = await handleRequest(
      contactRequest(),
      testEnv(
        async () => {
          emailSent = true;
          return { messageId: 'test-message' };
        },
        configuration,
      ),
      {
        verifyTurnstile: passesTurnstile,
        pushoverFetch: async () => {
          pushoverAttempted = true;
          return Response.json({ status: 1 });
        },
      },
      background.ctx,
    );

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true });
    assert.equal(emailSent, true);
    assert.equal(background.tasks.length, 1);
    await background.drain();
    assert.equal(pushoverAttempted, false);
  });
}
