export const WEB_BASE_URL = 'https://gugosf114.github.io/climate-permit';

export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=app.climatepermit.android';

export const APP_PACKAGE = 'app.climatepermit.android';

// Play Store install-referrer link.
// Recipient without app: installs from Play Store, app reads `referrer` on first launch via Play Install Referrer API,
// extracts the compat payload, routes to /compat/[payload].
// Recipient with app: Play Store opens with "Open" button — they tap it, app opens (referrer doesn't fire for already-installed users).
export function compatShareUrl(payload: string): string {
  const referrer = encodeURIComponent(`compat=${payload}`);
  return `${PLAY_STORE_URL}&referrer=${referrer}`;
}

// Legacy web-fallback URL (kept for backward compat — share link still lives in docs/compat/).
export function compatWebUrl(payload: string): string {
  return `${WEB_BASE_URL}/compat/?c=${payload}`;
}
