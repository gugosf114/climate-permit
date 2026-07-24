import { View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { BANNER_AD_UNIT_ID, ADS_ENABLED } from '../lib/ads';
import { useDMV } from '../constants/tokens';

/** Sticky bottom banner ad — renders nothing when real ad units aren't
 *  configured. Web builds use StickyBanner.web.tsx (no ads SDK there). */
export function StickyBanner() {
  const DMV = useDMV();
  if (!ADS_ENABLED) return null;
  return (
    <View style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      alignItems: 'center',
      backgroundColor: DMV.paperDeep,
      borderTopWidth: 1, borderTopColor: DMV.divider,
    }}>
      <BannerAd
        unitId={BANNER_AD_UNIT_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}
