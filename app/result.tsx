import { View, Text, TouchableOpacity, ScrollView, Share } from 'react-native';
import { useEffect, useRef } from 'react';
import { router } from 'expo-router';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import Svg, { Path } from 'react-native-svg';
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

const DMV = {
  paper:       '#f5efde',
  paperLight:  '#fbf6e6',
  paperDeep:   '#ede4c2',
  border:      '#8a7a3a',
  caBlue:      '#0e2d63',
  caBlueSoft:  '#1e4385',
  caBlueDeep:  '#081c44',
  ink:         '#0a0a0a',
  inkSoft:     '#2c2c2c',
  inkDim:      '#7a7a7a',
  red:         '#b41d23',
  redDeep:     '#7a1218',
  gold:        '#c78c19',
  goldDeep:    '#8b6310',
  hologram:    '#dba519',
  divider:     'rgba(20,20,20,0.18)',
};

function BearSilhouette({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size * 0.55} viewBox="0 0 100 55">
      <Path
        d="M 4 32 C 3 30, 4 27, 8 25 L 11 22 C 13 19, 16 17, 19 19 L 20 14 L 23 19 L 25 14 L 28 19 C 33 14, 41 11, 48 11 C 58 11, 68 13, 77 17 C 84 20, 89 24, 91 27 L 94 24 L 96 28 L 91 30 C 89 36, 86 41, 83 43 L 83 49 C 81 50, 78 50, 76 49 L 76 44 C 70 45, 64 45, 58 44 L 50 49 C 48 50, 45 50, 43 49 L 43 44 L 26 44 L 18 49 C 16 50, 13 50, 11 49 L 11 44 C 8 43, 5 38, 4 34 Z"
        fill={color}
      />
      <Path
        d="M 55 20 L 56.8 24 L 61 24 L 57.6 26.6 L 58.8 31 L 55 28.4 L 51.2 31 L 52.4 26.6 L 49 24 L 53.2 24 Z"
        fill={color}
      />
    </Svg>
  );
}

function OfficialHeader() {
  return (
    <View style={{
      paddingTop: 50, paddingBottom: 10, paddingHorizontal: 22,
      borderBottomWidth: 1, borderBottomColor: DMV.divider,
      backgroundColor: 'rgba(251,246,230,0.92)',
      flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
        <Text style={{
          fontFamily: 'serif', fontStyle: 'italic',
          fontSize: 28, color: DMV.caBlue, fontWeight: 'bold',
          lineHeight: 30, letterSpacing: -0.5,
        }}>
          California
        </Text>
        <Text style={{
          fontFamily: 'monospace', fontSize: 8, color: DMV.ink,
          fontWeight: 'bold', letterSpacing: 1, marginLeft: 3, marginBottom: 5,
        }}>
          USA
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <BearSilhouette size={32} color={DMV.gold} />
        <Text style={{
          fontFamily: undefined, fontSize: 10,
          color: DMV.caBlue, fontWeight: 'bold', letterSpacing: 1, marginTop: 2,
        }}>
          CLIMATE PERMIT
        </Text>
      </View>
    </View>
  );
}

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
      style={[{ position: 'absolute', top: 30, right: 14 }, stampStyle]}
    >
      <View style={{
        borderWidth: 2.5, borderColor: DMV.red, borderRadius: 4,
        paddingHorizontal: 12, paddingVertical: 5,
        backgroundColor: 'rgba(180, 29, 35, 0.07)',
        alignItems: 'center',
      }}>
        <Text style={{
          fontFamily: 'monospace', fontSize: 16, fontWeight: 'bold',
          color: DMV.red, letterSpacing: 4,
        }}>
          ISSUED
        </Text>
        <Text style={{
          fontFamily: 'monospace', fontSize: 7, color: DMV.red,
          letterSpacing: 2, opacity: 0.85, marginTop: 1,
        }}>
          DEPT · OF · CLIMATE · CONTROL
        </Text>
      </View>
    </Animated.View>
  );
}

export default function ResultScreen() {
  const viewShotRef = useRef<ViewShot>(null);
  const store = useClimateStore();
  const _archetype = ARCHETYPES.find((a) => a.id === store.archetypeId);

  if (!_archetype) {
    return (
      <View style={{ flex: 1, backgroundColor: DMV.paper, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <Text style={{
          fontFamily: 'monospace', fontSize: 11, color: DMV.caBlue,
          textTransform: 'uppercase', letterSpacing: 3, marginBottom: 4, fontWeight: 'bold',
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
            fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 3,
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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontFamily: 'monospace', fontSize: 9, color: DMV.red,
                fontWeight: 'bold', letterSpacing: 2.4, marginBottom: 4,
              }}>
                PERMIT ISSUED · SEE BELOW
              </Text>
              <Text style={{
                fontFamily: undefined, fontSize: 22, color: DMV.ink,
                fontWeight: 'bold', letterSpacing: -0.3,
              }}>
                {archetype.name}
              </Text>
              <Text style={{
                fontFamily: undefined, fontSize: 13, color: DMV.inkSoft,
                marginTop: 4, lineHeight: 18, fontStyle: 'italic',
              }}>
                {archetype.oneLineBurn}
              </Text>
            </View>
            <View style={{
              width: 32, height: 32,
              borderWidth: 1.5, borderColor: DMV.red,
              alignItems: 'center', justifyContent: 'center',
              backgroundColor: DMV.paperLight,
            }}>
              <Text style={{ fontFamily: 'monospace', fontSize: 14, color: DMV.red, fontWeight: 'bold' }}>
                ✓
              </Text>
            </View>
          </View>
          <View style={{ height: 3, width: 56, backgroundColor: DMV.red, marginTop: 10 }} />
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
            backgroundColor: 'rgba(255,250,225,0.6)',
          }}>
            <Text style={{
              fontFamily: 'monospace', fontSize: 8, color: DMV.caBlue,
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
            fontFamily: 'monospace', fontSize: 8, color: DMV.caBlue,
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
            activeOpacity={0.82}
            onPress={handleShare}
            style={{
              backgroundColor: DMV.caBlue,
              borderWidth: 1.5, borderColor: DMV.caBlueDeep,
              paddingVertical: 18, alignItems: 'center',
              shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
            }}
          >
            <Text style={{
              fontFamily: undefined, fontSize: 13, color: DMV.paperLight,
              fontWeight: 'bold', letterSpacing: 3, textTransform: 'uppercase',
            }}>
              Share Your Permit
            </Text>
          </TouchableOpacity>

          {hasCompat ? (
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={() => router.push(`/compat/${store.compatPayload}`)}
              style={{
                backgroundColor: DMV.red,
                borderWidth: 1.5, borderColor: DMV.redDeep,
                paddingVertical: 18, alignItems: 'center',
                shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 5, shadowOffset: { width: 0, height: 3 },
              }}
            >
              <Text style={{
                fontFamily: undefined, fontSize: 13, color: DMV.paperLight,
                fontWeight: 'bold', letterSpacing: 3, textTransform: 'uppercase',
              }}>
                View Compatibility  →
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
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
                fontWeight: 'bold', letterSpacing: 3, textTransform: 'uppercase',
              }}>
                Test Your Partner  →
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => { store.reset(); router.replace('/'); }}
            style={{ paddingVertical: 14, alignItems: 'center' }}
          >
            <Text style={{
              fontFamily: 'monospace', fontSize: 10, color: DMV.inkDim,
              textTransform: 'uppercase', letterSpacing: 2.5, fontWeight: 'bold',
            }}>
              Start Over
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Sticky banner ad */}
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
    </View>
  );
}
