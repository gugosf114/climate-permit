import MobileAds, {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

export const BANNER_AD_UNIT_ID = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : (process.env.EXPO_PUBLIC_ADMOB_BANNER_ID ?? TestIds.ADAPTIVE_BANNER);

export const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : (process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID ?? TestIds.INTERSTITIAL);

export async function initAds() {
  try {
    await MobileAds().initialize();
  } catch {
    // non-fatal on first launch
  }
}

export async function loadAndShowInterstitial(): Promise<void> {
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
