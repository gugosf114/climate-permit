import { View, Text, TouchableOpacity, ScrollView, Share } from 'react-native';
import { useEffect, useRef } from 'react';
import { router } from 'expo-router';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import Animated, {
  FadeIn, FadeInDown,
  useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay,
} from 'react-native-reanimated';
import { PermitCard } from '../components/PermitCard';
import { useClimateStore } from '../lib/store';
import { ARCHETYPES } from '../data/archetypes';
import { encodePayload } from '../lib/encode';
import { BANNER_AD_UNIT_ID } from '../lib/ads';
import { compatShareUrl, PLAY_STORE_URL } from '../lib/config';
import { palette as C, glow, goldBevel } from '../constants/tokens';

/** "ISSUED" official stamp that slams onto the permit just after it appears. */
function PermitStamp() {
  const scale = useSharedValue(2.6);
  const opacity = useSharedValue(0);
  useEffect(() => {
    opacity.value = withDelay(680, withTiming(1, { duration: 160 }));
    scale.value = withDelay(680, withSpring(1, { damping: 9, stiffness: 150, mass: 0.7 }));
  }, []);
  const stampStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ rotate: '-14deg' }, { scale: scale.value }],
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: 'absolute', top: 12, right: 8 }, stampStyle]}
    >
      <View style={{
        borderWidth: 2.5, borderColor: C.red, borderRadius: 6,
        paddingHorizontal: 10, paddingVertical: 4,
        backgroundColor: 'rgba(199, 84, 68, 0.10)',
        alignItems: 'center',
      }}>
        <Text style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 'bold', color: C.red, letterSpacing: 3, ...glow(C.red, 6) }}>
          ISSUED
        </Text>
        <Text style={{ fontFamily: 'monospace', fontSize: 6, color: C.red, letterSpacing: 2, opacity: 0.85, marginTop: 1 }}>
          DEPT · OF · CLIMATE
        </Text>
      </View>
    </Animated.View>
  );
}

export default function ResultScreen() {
  const viewShotRef = useRef<ViewShot>(null);
  const store = useClimateStore();
  const _archetype = ARCHETYPES.find((a) => a.id === store.archetypeId);

  // No archetype on file (e.g. cold deep-link) — never render a blank screen.
  if (!_archetype) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <Text style={{
          fontFamily: 'monospace', fontSize: 12, color: C.gold, textTransform: 'uppercase',
          letterSpacing: 3, textAlign: 'center', marginBottom: 20, opacity: 0.85,
        }}>
          No permit on file
        </Text>
        <TouchableOpacity
          style={{ backgroundColor: C.gold, ...goldBevel, paddingVertical: 16, paddingHorizontal: 32 }}
          onPress={() => { store.reset(); router.replace('/'); }}
          activeOpacity={0.88}
        >
          <Text style={{ fontFamily: 'monospace', fontSize: 11, color: C.bg, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 }}>
            Start Over
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
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
            fontFamily: 'monospace', fontSize: 9, color: C.gold,
            opacity: 0.8, textTransform: 'uppercase', letterSpacing: 4,
          }}>
            Permit Issued
          </Text>
          <Text style={{
            fontFamily: 'monospace', fontSize: 22, color: C.goldBright,
            fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 3, marginTop: 6,
            ...glow(C.gold, 14),
          }}>
            {archetype.name}
          </Text>
          <Text style={{
            fontFamily: 'monospace', fontSize: 11, color: C.text,
            marginTop: 8, opacity: 0.8, lineHeight: 17,
          }}>
            {archetype.oneLineBurn}
          </Text>
        </Animated.View>

        {/* Permit Card + stamp */}
        <Animated.View entering={FadeInDown.duration(700).delay(200)} style={{ paddingHorizontal: 18, paddingTop: 22 }}>
          <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.95 }}>
            <View style={{ position: 'relative' }}>
              <PermitCard archetype={archetype} make={store.make} model={store.model} answers={store.answers} />
              <PermitStamp />
            </View>
          </ViewShot>
        </Animated.View>

        {/* Quadrant + bias pills */}
        <Animated.View entering={FadeInDown.duration(500).delay(450)} style={{
          paddingHorizontal: 22, paddingTop: 18, paddingBottom: 8,
          flexDirection: 'row', gap: 8, flexWrap: 'wrap',
        }}>
          <View style={{
            backgroundColor: C.gold,
            borderTopColor: C.goldBright, borderLeftColor: C.goldBright,
            borderBottomColor: C.goldDim, borderRightColor: C.goldDim,
            borderWidth: 1,
            paddingHorizontal: 12, paddingVertical: 5,
          }}>
            <Text style={{
              fontFamily: 'monospace', fontSize: 9, color: C.bg,
              fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2,
            }}>
              {archetype.quadrant}
            </Text>
          </View>
          <View style={{
            backgroundColor: C.tile,
            borderTopColor: C.tileHi, borderLeftColor: C.tileHi,
            borderBottomColor: C.tileLo, borderRightColor: C.tileLo,
            borderWidth: 1,
            paddingHorizontal: 12, paddingVertical: 5,
          }}>
            <Text style={{
              fontFamily: 'monospace', fontSize: 9, color: C.text,
              textTransform: 'uppercase', letterSpacing: 1.5,
            }}>
              {archetype.xBias === 'self' ? 'Self-Focused' : 'Other-Focused'}  ·  {archetype.yBias === 'controller' ? 'Controller' : 'Chill'}
            </Text>
          </View>
        </Animated.View>

        {/* Compat traits */}
        <Animated.View entering={FadeInDown.duration(500).delay(600)} style={{ paddingHorizontal: 22, paddingBottom: 24 }}>
          <Text style={{
            fontFamily: 'monospace', fontSize: 8, color: C.gold,
            opacity: 0.6, marginBottom: 5, textTransform: 'uppercase', letterSpacing: 2,
          }}>
            Compatible with
          </Text>
          <Text style={{ fontFamily: 'monospace', fontSize: 11, color: C.text, lineHeight: 18 }}>
            {archetype.compatTraits.join('  ·  ')}
          </Text>
        </Animated.View>

        {/* Actions */}
        <Animated.View entering={FadeIn.duration(500).delay(800)} style={{ paddingHorizontal: 22, gap: 10 }}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleShare}
            style={{
              backgroundColor: C.gold, ...goldBevel,
              paddingVertical: 18, alignItems: 'center',
              shadowColor: C.gold, shadowOpacity: 0.45, shadowRadius: 16, shadowOffset: { width: 0, height: 5 },
            }}
          >
            <Text style={{
              fontFamily: 'monospace', fontSize: 12, color: C.bg,
              fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 3,
            }}>
              Share Your Permit
            </Text>
          </TouchableOpacity>

          {hasCompat ? (
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => router.push(`/compat/${store.compatPayload}`)}
              style={{
                backgroundColor: C.red,
                borderTopColor: C.redBright, borderLeftColor: C.redBright,
                borderBottomColor: C.redDeep, borderRightColor: C.redDeep,
                borderWidth: 1.5,
                paddingVertical: 18, alignItems: 'center',
                shadowColor: C.red, shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
              }}
            >
              <Text style={{
                fontFamily: 'monospace', fontSize: 12, color: C.text,
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
                fontFamily: 'monospace', fontSize: 12, color: C.gold,
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
              fontFamily: 'monospace', fontSize: 10, color: C.textMuted,
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
      }}>
        <BannerAd
          unitId={BANNER_AD_UNIT_ID}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        />
      </View>
    </View>
  );
}
