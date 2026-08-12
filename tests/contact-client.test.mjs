import test from 'node:test';
import assert from 'node:assert/strict';
import { CONTACT_MESSAGES, getContactOutcome } from '../src/scripts/contact-form-state.js';

test('maps a successful API response to the success UI state', () => {
  assert.equal(getContactOutcome(true, { success: true }), 'success');
  assert.match(CONTACT_MESSAGES.success, /got your message/i);
});

test('maps Turnstile failures to the verification UI state', () => {
  assert.equal(getContactOutcome(false, { success: false, error: 'verification' }), 'verification');
  assert.match(CONTACT_MESSAGES.verification, /verification/i);
});

test('maps delivery and malformed responses to the general error UI state', () => {
  assert.equal(getContactOutcome(false, { success: false, error: 'server' }), 'error');
  assert.equal(getContactOutcome(true, null), 'error');
});
