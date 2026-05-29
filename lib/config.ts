export const WEB_BASE_URL = 'https://gugosf114.github.io/climate-permit';

export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=app.climatepermit.android';

export function compatShareUrl(payload: string): string {
  return `${WEB_BASE_URL}/compat/?c=${payload}`;
}
