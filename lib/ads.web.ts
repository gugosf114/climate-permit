/**
 * Web stand-in for lib/ads.ts. The AdMob SDK is Android-only and its
 * package can't even bundle for web (it imports react-native internals),
 * so Metro picks this file for web builds via platform extensions.
 * Ads simply don't exist on web; every entry point no-ops.
 */
export const ADS_ENABLED = false;
export const BANNER_AD_UNIT_ID = '';
export const INTERSTITIAL_AD_UNIT_ID = '';

export async function initAds() {}

export async function loadAndShowInterstitial(): Promise<void> {}
