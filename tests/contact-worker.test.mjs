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

function testEnv(send = async () => ({ messageId: 'test-message' })) {
  return { TURNSTILE_SECRET: 'test-only', EMAIL: { send } };
}

const passesTurnstile = async () => ({ success: true });

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
  const response = await handleRequest(
    contactRequest({ ...validFields, website: 'https://spam.example' }),
    testEnv(async () => {
      sent = true;
    }),
    { verifyTurnstile: passesTurnstile },
  );
  assert.equal(response.status, 200);
  assert.equal(sent, false);
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
  const response = await handleRequest(
    contactRequest(),
    testEnv(async () => {
      sent = true;
    }),
    { verifyTurnstile: async () => ({ success: false }) },
  );
  assert.equal(response.status, 403);
  assert.equal(sent, false);
});

test('returns a server error when Turnstile verification is unavailable', async () => {
  const response = await handleRequest(
    contactRequest(),
    testEnv(),
    { verifyTurnstile: async () => ({ success: false, unavailable: true }) },
  );
  assert.equal(response.status, 500);
});

test('returns a server error when email delivery fails', async () => {
  const response = await handleRequest(
    contactRequest(),
    testEnv(async () => {
      throw new Error('simulated email failure');
    }),
    { verifyTurnstile: passesTurnstile },
  );
  assert.equal(response.status, 500);
});
