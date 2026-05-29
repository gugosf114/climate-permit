import { View, Text, TouchableOpacity, ScrollView, Share } from 'react-native';
import { useRef } from 'react';
import { router } from 'expo-router';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { PermitCard } from '../components/PermitCard';
import { useClimateStore } from '../lib/store';
import { ARCHETYPES } from '../data/archetypes';
import { encodePayload } from '../lib/encode';
import { BANNER_AD_UNIT_ID } from '../lib/ads';
import { compatShareUrl, WEB_BASE_URL } from '../lib/config';

export default function ResultScreen() {
  const viewShotRef = useRef<ViewShot>(null);
  const store = useClimateStore();
  const _archetype = ARCHETYPES.find((a) => a.id === store.archetypeId);
  if (!_archetype) return null;
  const archetype = _archetype;

  async function handleShare() {
    try {
      const uri = await (viewShotRef.current as any)?.capture?.();
      if (!uri) return;
      const dest = FileSystem.cacheDirectory + 'permit.jpg';
      await FileSystem.copyAsync({ from: uri, to: dest });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(dest, { mimeType: 'image/jpeg', dialogTitle: 'Share your Climate Operator Permit' });
      } else {
        Share.share({ message: `I got "${archetype.name}" on Climate Permit. ${WEB_BASE_URL}` });
      }
    } catch (e) {
      Share.share({ message: `I got "${archetype.name}" on Climate Permit. ${WEB_BASE_URL}` });
    }
  }

  async function handleCompatLink() {
    const payload = encodePayload({
      answers: store.answers as Record<string, string | number>,
      archetypeId: archetype.id,
      x: store.xScore,
      y: store.yScore,
      make: store.make,
      model: store.model,
    });
    const link = compatShareUrl(payload);
    Share.share({
      message: `I got "${archetype.name}" on Climate Permit 🌡️ What's your climate type? Take the quiz and see our compatibility:\n${link}`,
    });
  }

  const hasCompat = Boolean(store.compatPayload);

  return (
    <View style={{ flex: 1, backgroundColor: '#f4f0e6' }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View style={{ paddingTop: 60, paddingBottom: 14, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#1a3a1a' }}>
          <Text style={{ fontFamily: 'monospace', fontSize: 9, color: '#1a3a1a', opacity: 0.5, textTransform: 'uppercase', letterSpacing: 2 }}>
            Permit Issued
          </Text>
          <Text style={{ fontFamily: 'monospace', fontSize: 20, color: '#1a3a1a', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginTop: 4 }}>
            {archetype.name}
          </Text>
          <Text style={{ fontFamily: 'monospace', fontSize: 10, color: '#1a3a1a', marginTop: 4, opacity: 0.6 }}>
            {archetype.oneLineBurn}
          </Text>
        </View>

        {/* Permit Card */}
        <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
          <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.95 }}>
            <PermitCard archetype={archetype} make={store.make} model={store.model} answers={store.answers} />
          </ViewShot>
        </View>

        {/* Quadrant label */}
        <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8, flexDirection: 'row', gap: 8 }}>
          <View style={{ backgroundColor: '#1a3a1a', paddingHorizontal: 10, paddingVertical: 4 }}>
            <Text style={{ fontFamily: 'monospace', fontSize: 9, color: '#f4f0e6', textTransform: 'uppercase', letterSpacing: 1 }}>
              {archetype.quadrant}
            </Text>
          </View>
          <View style={{ borderWidth: 1, borderColor: '#1a3a1a', paddingHorizontal: 10, paddingVertical: 4 }}>
            <Text style={{ fontFamily: 'monospace', fontSize: 9, color: '#1a3a1a', textTransform: 'uppercase', letterSpacing: 1 }}>
              {archetype.xBias === 'self' ? 'Self-Focused' : 'Other-Focused'}  ·  {archetype.yBias === 'controller' ? 'Controller' : 'Chill'}
            </Text>
          </View>
        </View>

        {/* Compat traits */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 20 }}>
          <Text style={{ fontFamily: 'monospace', fontSize: 9, color: '#1a3a1a', opacity: 0.5, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
            Compatible with:
          </Text>
          <Text style={{ fontFamily: 'monospace', fontSize: 10, color: '#1a3a1a' }}>
            {archetype.compatTraits.join('  ·  ')}
          </Text>
        </View>

        {/* Actions */}
        <View style={{ paddingHorizontal: 24, gap: 10 }}>
          <TouchableOpacity
            style={{ backgroundColor: '#1a3a1a', paddingVertical: 18, alignItems: 'center' }}
            onPress={handleShare}
            activeOpacity={0.85}
          >
            <Text style={{ fontFamily: 'monospace', fontSize: 12, color: '#f4f0e6', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 3 }}>
              Share Your Permit
            </Text>
          </TouchableOpacity>

          {hasCompat ? (
            <TouchableOpacity
              style={{ backgroundColor: '#8b2020', paddingVertical: 18, alignItems: 'center' }}
              onPress={() => router.push(`/compat/${store.compatPayload}`)}
              activeOpacity={0.85}
            >
              <Text style={{ fontFamily: 'monospace', fontSize: 12, color: '#f4f0e6', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 3 }}>
                View Compatibility →
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{ borderWidth: 1, borderColor: '#1a3a1a', paddingVertical: 18, alignItems: 'center' }}
              onPress={handleCompatLink}
              activeOpacity={0.85}
            >
              <Text style={{ fontFamily: 'monospace', fontSize: 12, color: '#1a3a1a', textTransform: 'uppercase', letterSpacing: 2 }}>
                Test Your Partner →
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={{ paddingVertical: 12, alignItems: 'center' }}
            onPress={() => { store.reset(); router.replace('/'); }}
            activeOpacity={0.7}
          >
            <Text style={{ fontFamily: 'monospace', fontSize: 10, color: '#1a3a1a', textTransform: 'uppercase', letterSpacing: 2, opacity: 0.4 }}>
              Start Over
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Sticky banner ad */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center', backgroundColor: '#f4f0e6' }}>
        <BannerAd
          unitId={BANNER_AD_UNIT_ID}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        />
      </View>
    </View>
  );
}
