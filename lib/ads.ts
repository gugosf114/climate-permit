import MobileAds, {
  AdsConsent,
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

/**
 * Ad unit resolution:
 * - Debug builds always use Google's test units.
 * - Release builds use the real units from EXPO_PUBLIC_ADMOB_* (set in
 *   eas.json production env). If they're missing or still placeholders,
 *   ads are DISABLED entirely — serving test ads in production violates
 *   AdMob policy, and silently shipping them was the old failure mode.
 */
function realUnit(value: string | undefined): string | null {
  if (!value || value.includes('REPLACE')) return null;
  return value;
}

const PROD_BANNER = realUnit(process.env.EXPO_PUBLIC_ADMOB_BANNER_ID);
const PROD_INTERSTITIAL = realUnit(process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID);

export const ADS_ENABLED = __DEV__ || (PROD_BANNER !== null && PROD_INTERSTITIAL !== null);

export const BANNER_AD_UNIT_ID = __DEV__ ? TestIds.ADAPTIVE_BANNER : (PROD_BANNER ?? '');

export const INTERSTITIAL_AD_UNIT_ID = __DEV__ ? TestIds.INTERSTITIAL : (PROD_INTERSTITIAL ?? '');

/**
 * Gather UMP consent (GDPR/EEA + UK) before initializing the SDK, per
 * AdMob policy. gatherConsent() no-ops outside regions that require it.
 * We always request non-personalized ads, so any consent outcome that
 * allows ad requests at all is sufficient.
 */
export async function initAds() {
  if (!ADS_ENABLED) return;
  try {
    await AdsConsent.gatherConsent();
  } catch {
    // consent form unavailable (offline, misconfig) — SDK still serves
    // limited/NPA ads where allowed
  }
  try {
    await MobileAds().initialize();
  } catch {
    // non-fatal on first launch
  }
}

export async function loadAndShowInterstitial(): Promise<void> {
  if (!ADS_ENABLED) return;
  return new Promise((resolve) => {
    try {
      const ad = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
        requestNonPersonalizedAdsOnly: true,
      });
      const unsubLoad = ad.addAdEventListener(AdEventType.LOADED, () => {
        unsubLoad();
        ad.show().catch(() => {}).finally(resolve);
      });
      const unsubErr = ad.addAdEventListener(AdEventType.ERROR, () => {
        unsubErr();
        resolve();
      });
      ad.load();
    } catch {
      resolve();
    }
  });
}
