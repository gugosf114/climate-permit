import { View, Text, TouchableOpacity, ScrollView, Share } from 'react-native';
import { useRef } from 'react';
import { router } from 'expo-router';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { PermitCard } from '../components/PermitCard';
import { useClimateStore } from '../lib/store';
import { ARCHETYPES } from '../data/archetypes';
import { encodePayload } from '../lib/encode';
import { BANNER_AD_UNIT_ID } from '../lib/ads';
import { compatShareUrl, PLAY_STORE_URL } from '../lib/config';
import { useTheme, F } from '../constants/palette';
import { MetalButton, GoldSurface } from '../components/ui/gold';

export default function ResultScreen() {
  const C = useTheme();
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
        await Sharing.shareAsync(dest, { mimeType: 'image/jpeg', dialogTitle: 'Share your Climate Permit' });
      } else {
        Share.share({ message: `I got "${archetype.name}" on Climate Permit. Get it: ${PLAY_STORE_URL}` });
      }
    } catch (e) {
      Share.share({ message: `I got "${archetype.name}" on Climate Permit. Get it: ${PLAY_STORE_URL}` });
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
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 130 }}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(500)} style={{
          paddingTop: 60, paddingBottom: 18, paddingHorizontal: 24,
          borderBottomWidth: 1, borderBottomColor: C.divider,
        }}>
          <Text style={{
            fontFamily: F.mono, fontSize: 9, color: C.gold,
            opacity: 0.8, textTransform: 'uppercase', letterSpacing: 4,
          }}>
            Permit Issued
          </Text>
          <Text style={{
            fontFamily: F.display, fontSize: 22, color: C.goldBright,
            textTransform: 'uppercase', letterSpacing: 1, marginTop: 8,
            lineHeight: 28,
            textShadowColor: C.gold, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 14,
          }}>
            {archetype.name}
          </Text>
          <Text style={{
            fontFamily: F.mono, fontSize: 11, color: C.text,
            marginTop: 8, opacity: 0.8, lineHeight: 17,
          }}>
            {archetype.oneLineBurn}
          </Text>
        </Animated.View>

        {/* Permit Card */}
        <Animated.View entering={FadeInDown.duration(700).delay(200)} style={{ paddingHorizontal: 18, paddingTop: 22 }}>
          <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.95 }}>
            <PermitCard archetype={archetype} make={store.make} model={store.model} answers={store.answers} />
          </ViewShot>
        </Animated.View>

        {/* Quadrant + bias pills */}
        <Animated.View entering={FadeInDown.duration(500).delay(450)} style={{
          paddingHorizontal: 22, paddingTop: 18, paddingBottom: 8,
          flexDirection: 'row', gap: 8, flexWrap: 'wrap',
        }}>
          <GoldSurface style={{ paddingHorizontal: 12, paddingVertical: 5 }}>
            <Text style={{
              fontFamily: F.mono, fontSize: 9, color: C.bg,
              fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2,
            }}>
              {archetype.quadrant}
            </Text>
          </GoldSurface>
          <View style={{
            backgroundColor: C.tile,
            borderTopColor: C.tileHi, borderLeftColor: C.tileHi,
            borderBottomColor: C.tileLo, borderRightColor: C.tileLo,
            borderWidth: 1,
            paddingHorizontal: 12, paddingVertical: 5,
          }}>
            <Text style={{
              fontFamily: F.mono, fontSize: 9, color: C.text,
              textTransform: 'uppercase', letterSpacing: 1.5,
            }}>
              {archetype.xBias === 'self' ? 'Self-Focused' : 'Other-Focused'}  ·  {archetype.yBias === 'controller' ? 'Controller' : 'Chill'}
            </Text>
          </View>
        </Animated.View>

        {/* Compat traits */}
        <Animated.View entering={FadeInDown.duration(500).delay(600)} style={{ paddingHorizontal: 22, paddingBottom: 24 }}>
          <Text style={{
            fontFamily: F.mono, fontSize: 8, color: C.gold,
            opacity: 0.6, marginBottom: 5, textTransform: 'uppercase', letterSpacing: 2,
          }}>
            Compatible with
          </Text>
          <Text style={{ fontFamily: F.mono, fontSize: 11, color: C.text, lineHeight: 18 }}>
            {archetype.compatTraits.join('  ·  ')}
          </Text>
        </Animated.View>

        {/* Actions */}
        <Animated.View entering={FadeIn.duration(500).delay(800)} style={{ paddingHorizontal: 22, gap: 10 }}>
          <MetalButton onPress={handleShare}>
            <Text style={{
              fontFamily: F.mono, fontSize: 12, color: C.bg,
              fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 3,
            }}>
              Share Your Permit
            </Text>
          </MetalButton>

          {hasCompat ? (
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => router.push(`/compat/${store.compatPayload}`)}
              style={{
                backgroundColor: C.red,
                borderTopColor: '#e07060', borderLeftColor: '#e07060',
                borderBottomColor: '#7a2818', borderRightColor: '#7a2818',
                borderWidth: 1.5,
                paddingVertical: 18, alignItems: 'center',
                shadowColor: C.red, shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
              }}
            >
              <Text style={{
                fontFamily: F.mono, fontSize: 12, color: C.text,
                fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 3,
              }}>
                View Compatibility  →
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleCompatLink}
              style={{
                backgroundColor: C.tile,
                borderTopColor: C.tileHi, borderLeftColor: C.tileHi,
                borderBottomColor: C.tileLo, borderRightColor: C.tileLo,
                borderWidth: 1.5,
                paddingVertical: 18, alignItems: 'center',
              }}
            >
              <Text style={{
                fontFamily: F.mono, fontSize: 12, color: C.gold,
                textTransform: 'uppercase', letterSpacing: 2.5,
              }}>
                Test Your Partner  →
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => { store.reset(); router.replace('/'); }}
            style={{ paddingVertical: 14, alignItems: 'center' }}
          >
            <Text style={{
              fontFamily: F.mono, fontSize: 10, color: C.textMuted,
              textTransform: 'uppercase', letterSpacing: 2.5,
            }}>
              Start Over
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Sticky banner ad */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        alignItems: 'center', backgroundColor: C.bg2,
        borderTopWidth: 1, borderTopColor: C.divider,
        paddingTop: 5,
      }}>
        <Text style={{
          fontFamily: F.mono, fontSize: 7, color: C.textMuted,
          letterSpacing: 2.5, textTransform: 'uppercase', opacity: 0.7,
          marginBottom: 3,
        }}>
          Advertisement
        </Text>
        <BannerAd
          unitId={BANNER_AD_UNIT_ID}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        />
      </View>
    </View>
  );
}
