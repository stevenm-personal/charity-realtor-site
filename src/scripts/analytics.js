export const GA4_MEASUREMENT_ID = 'G-9FJH7TSK3Y';
export const GA4_PRODUCTION_HOSTNAME = 'charitymenefee.com';
export const ANALYTICS_LEAD_EVENT = 'charity:generate-lead';

export function shouldLoadGoogleAnalytics(hostname) {
  return hostname === GA4_PRODUCTION_HOSTNAME;
}

export function getContactClickMethod(href) {
  if (typeof href !== 'string') return null;

  const normalizedHref = href.trim().toLowerCase();
  if (normalizedHref.startsWith('tel:')) return 'phone';
  if (normalizedHref.startsWith('mailto:')) return 'email';
  return null;
}

export function emitConfirmedLead(outcome, dispatch = (eventName) => {
  document.dispatchEvent(new Event(eventName));
}) {
  if (outcome !== 'success') return false;

  try {
    dispatch(ANALYTICS_LEAD_EVENT);
    return true;
  } catch {
    return false;
  }
}
