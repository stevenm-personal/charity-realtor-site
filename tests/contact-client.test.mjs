import test from 'node:test';
import assert from 'node:assert/strict';
import { CONTACT_MESSAGES, getContactOutcome } from '../src/scripts/contact-form-state.js';
import {
  ANALYTICS_LEAD_EVENT,
  GA4_MEASUREMENT_ID,
  emitConfirmedLead,
  getContactClickMethod,
  shouldLoadGoogleAnalytics,
} from '../src/scripts/analytics.js';

test('maps a successful API response to the success UI state', () => {
  assert.equal(getContactOutcome(true, { success: true }), 'success');
  assert.equal(CONTACT_MESSAGES.successHeading, 'Message sent!');
  assert.equal(CONTACT_MESSAGES.success, "Thanks, I got your message. I'll get back to you as soon as I can.");
});

test('maps Turnstile failures to the verification UI state', () => {
  assert.equal(getContactOutcome(false, { success: false, error: 'verification' }), 'verification');
  assert.match(CONTACT_MESSAGES.verification, /verification/i);
});

test('maps delivery and malformed responses to the general error UI state', () => {
  assert.equal(getContactOutcome(false, { success: false, error: 'server' }), 'error');
  assert.equal(getContactOutcome(true, null), 'error');
});

test('loads GA4 only on the exact production hostname', () => {
  assert.equal(GA4_MEASUREMENT_ID, 'G-9FJH7TSK3Y');
  assert.equal(shouldLoadGoogleAnalytics('charitymenefee.com'), true);
  assert.equal(shouldLoadGoogleAnalytics('www.charitymenefee.com'), false);
  assert.equal(shouldLoadGoogleAnalytics('localhost'), false);
  assert.equal(shouldLoadGoogleAnalytics('charity-realtor-site.chalkjhawk79.workers.dev'), false);
  assert.equal(shouldLoadGoogleAnalytics('qa.charitymenefee.com'), false);
});

test('emits one lead signal only for a confirmed successful response', () => {
  const dispatchedEvents = [];
  const dispatch = (eventName) => dispatchedEvents.push(eventName);

  assert.equal(emitConfirmedLead('verification', dispatch), false);
  assert.equal(emitConfirmedLead('error', dispatch), false);
  assert.deepEqual(dispatchedEvents, []);

  assert.equal(emitConfirmedLead('success', dispatch), true);
  assert.deepEqual(dispatchedEvents, [ANALYTICS_LEAD_EVENT]);
});

test('maps contact links to generic non-PII methods', () => {
  assert.equal(getContactClickMethod('tel:7858210992'), 'phone');
  assert.equal(getContactClickMethod('mailto:charity@curtiscrewict.com'), 'email');
  assert.equal(getContactClickMethod('/contact/'), null);
});
