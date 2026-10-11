import { View, Text, TouchableOpacity, ScrollView, Share } from 'react-native';
import { useEffect, useRef } from 'react';
import { router } from 'expo-router';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import Animated, {
  FadeIn, FadeInDown,
  useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay,
} from 'react-native-reanimated';
import { PermitCard } from '../components/PermitCard';
import { useClimateStore } from '../lib/store';
import { ARCHETYPES } from '../data/archetypes';
import { encodePayload } from '../lib/encode';
import { StickyBanner } from '../components/StickyBanner';
import { compatShareUrl, PLAY_STORE_URL } from '../lib/config';
import { useDMV } from '../constants/tokens';
import { OfficialHeader, SectionHeader } from '../components/Chrome';

/** "ISSUED" official stamp that slams onto the permit just after it appears. */
function PermitStamp() {
  const DMV = useDMV();
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
      style={[{ position: 'absolute', bottom: 96, right: 26 }, stampStyle]}
    >
      <View style={{
        borderWidth: 2.5, borderColor: DMV.red, borderRadius: 4,
        paddingHorizontal: 12, paddingVertical: 5,
        backgroundColor: 'rgba(180, 29, 35, 0.07)',
        alignItems: 'center',
      }}>
        <Text style={{
          fontFamily: 'monospace', fontSize: 16, fontWeight: 'bold',
          color: DMV.red, letterSpacing: 1.5,
        }}>
          ISSUED
        </Text>
        <Text style={{
          fontFamily: 'monospace', fontSize: 9, color: DMV.red,
          letterSpacing: 1.2, opacity: 0.85, marginTop: 1,
        }}>
          DEPT · OF · CLIMATE · CONTROL
        </Text>
      </View>
    </Animated.View>
  );
}

export default function ResultScreen() {
  const DMV = useDMV();
  const viewShotRef = useRef<ViewShot>(null);
  const store = useClimateStore();
  const _archetype = ARCHETYPES.find((a) => a.id === store.archetypeId);

  if (!_archetype) {
    return (
      <View style={{ flex: 1, backgroundColor: DMV.paper, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <Text style={{
          fontFamily: 'monospace', fontSize: 11, color: DMV.caBlue,
          textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4, fontWeight: 'bold',
        }}>
          NO PERMIT ON FILE
        </Text>
        <Text style={{
          fontFamily: undefined, fontSize: 14, color: DMV.ink,
          marginBottom: 24, textAlign: 'center',
        }}>
          The application must be completed in full before a permit is issued.
        </Text>
        <TouchableOpacity
            accessibilityRole="button"
          style={{
            backgroundColor: DMV.caBlue,
            paddingVertical: 16, paddingHorizontal: 36,
            borderWidth: 1.5, borderColor: DMV.caBlueDeep,
          }}
          onPress={() => { store.reset(); router.replace('/'); }}
          activeOpacity={0.82}
        >
          <Text style={{
            fontFamily: undefined, fontSize: 13, color: DMV.paperLight,
            fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5,
          }}>
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
    } catch {
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
    <View style={{ flex: 1, backgroundColor: DMV.paper }}>
      <OfficialHeader />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Section header */}
        <Animated.View entering={FadeIn.duration(500)} style={{
          paddingTop: 18, paddingBottom: 14, paddingHorizontal: 22,
        }}>
          <SectionHeader
            kicker="PERMIT ISSUED · SEE BELOW"
            kickerColor={DMV.red}
            title={archetype.name}
            subtitle={archetype.oneLineBurn}
            boxChar="✓"
          />
        </Animated.View>

        {/* Permit Card + stamp */}
        <Animated.View entering={FadeInDown.duration(700).delay(180)} style={{ paddingHorizontal: 16, paddingTop: 6 }}>
          <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.95 }}>
            <View style={{ position: 'relative' }}>
              <PermitCard archetype={archetype} make={store.make} model={store.model} answers={store.answers} />
              <PermitStamp />
            </View>
          </ViewShot>
        </Animated.View>

        {/* Field box: quadrant + bias */}
        <Animated.View entering={FadeInDown.duration(500).delay(400)} style={{
          paddingHorizontal: 22, paddingTop: 22,
        }}>
          <View style={{
            borderLeftWidth: 3, borderLeftColor: DMV.caBlue,
            paddingLeft: 14, paddingVertical: 10, marginBottom: 14,
            backgroundColor: DMV.noticeWash,
          }}>
            <Text style={{
              fontFamily: 'monospace', fontSize: 10, color: DMV.caBlue,
              fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 4,
            }}>
              9 · QUADRANT · BIAS PROFILE
            </Text>
            <Text style={{ fontFamily: undefined, fontSize: 14, color: DMV.ink, fontWeight: 'bold' }}>
              {archetype.quadrant}
            </Text>
            <Text style={{ fontFamily: undefined, fontSize: 12, color: DMV.inkSoft, marginTop: 2 }}>
              {archetype.xBias === 'self' ? 'Self-Focused' : 'Other-Focused'}  ·  {archetype.yBias === 'controller' ? 'Controller' : 'Chill'}
            </Text>
          </View>
        </Animated.View>

        {/* Compatible traits */}
        <Animated.View entering={FadeInDown.duration(500).delay(540)} style={{ paddingHorizontal: 22, paddingBottom: 24 }}>
          <Text style={{
            fontFamily: 'monospace', fontSize: 10, color: DMV.caBlue,
            fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 4,
          }}>
            18 · COMPATIBLE OPERATORS
          </Text>
          <Text style={{ fontFamily: undefined, fontSize: 13, color: DMV.ink, lineHeight: 18 }}>
            {archetype.compatTraits.join('  ·  ')}
          </Text>
        </Animated.View>

        {/* Actions */}
        <Animated.View entering={FadeIn.duration(500).delay(720)} style={{ paddingHorizontal: 22, gap: 10 }}>
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.82}
            onPress={handleShare}
            style={{
              backgroundColor: DMV.caBlue,
              borderWidth: 1.5, borderColor: DMV.caBlueDeep,
              paddingVertical: 18, alignItems: 'center',
              shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
              elevation: 3,
            }}
          >
            <Text style={{
              fontFamily: undefined, fontSize: 13, color: DMV.paperLight,
              fontWeight: 'bold', letterSpacing: 1.5, textTransform: 'uppercase',
            }}>
              Share Your Permit
            </Text>
          </TouchableOpacity>

          {hasCompat ? (
            <TouchableOpacity
            accessibilityRole="button"
              activeOpacity={0.82}
              onPress={() => router.push(`/compat/${store.compatPayload}`)}
              style={{
                backgroundColor: DMV.red,
                borderWidth: 1.5, borderColor: DMV.redDeep,
                paddingVertical: 18, alignItems: 'center',
                shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 5, shadowOffset: { width: 0, height: 3 },
                elevation: 3,
              }}
            >
              <Text style={{
                fontFamily: undefined, fontSize: 13, color: DMV.paperLight,
                fontWeight: 'bold', letterSpacing: 1.5, textTransform: 'uppercase',
              }}>
                View Compatibility  →
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
            accessibilityRole="button"
              activeOpacity={0.78}
              onPress={handleCompatLink}
              style={{
                backgroundColor: DMV.paperLight,
                borderWidth: 1.5, borderColor: DMV.caBlue,
                paddingVertical: 18, alignItems: 'center',
              }}
            >
              <Text style={{
                fontFamily: undefined, fontSize: 13, color: DMV.caBlue,
                fontWeight: 'bold', letterSpacing: 1.5, textTransform: 'uppercase',
              }}>
                Test Your Partner  →
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.6}
            onPress={() => { store.reset(); router.replace('/'); }}
            style={{ paddingVertical: 14, alignItems: 'center' }}
          >
            <Text style={{
              fontFamily: 'monospace', fontSize: 10, color: DMV.inkDim,
              textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 'bold',
            }}>
              Start Over
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      <StickyBanner />
    </View>
  );
}
