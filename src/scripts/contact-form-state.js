export const CONTACT_MESSAGES = Object.freeze({
  sending: 'Sending your message.',
  successHeading: 'Message sent!',
  success: "Thanks, I got your message. I'll get back to you as soon as I can.",
  verification: 'Please complete the verification and try again.',
});

export function getContactOutcome(responseOk, result) {
  if (responseOk && result?.success === true) return 'success';
  if (result?.error === 'verification') return 'verification';
  return 'error';
}
