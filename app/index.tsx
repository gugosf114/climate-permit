import { View, Text } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, FadeIn, FadeInDown } from 'react-native-reanimated';
import { C, F, PANEL_GRADIENT, GRAD_TOP, GRAD_BOTTOM } from '../constants/palette';
import { MetalButton } from '../components/ui/gold';

function Seal() {
  const pulse = useSharedValue(0.85);
  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, []);
  const halo = useAnimatedStyle(() => ({ opacity: pulse.value * 0.45 }));

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 56 }}>
      {/* outer halo */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: 220, height: 220, borderRadius: 110,
            backgroundColor: C.gold,
            opacity: 0.18,
          },
          halo,
        ]}
      />
      {/* outer ring */}
      <View
        style={{
          width: 160, height: 160, borderRadius: 80,
          borderWidth: 2, borderColor: C.gold,
          alignItems: 'center', justifyContent: 'center',
          backgroundColor: C.bg2,
          shadowColor: C.gold, shadowOpacity: 0.6, shadowRadius: 24, shadowOffset: { width: 0, height: 0 },
        }}
      >
        {/* inner ring */}
        <View
          style={{
            width: 134, height: 134, borderRadius: 67,
            borderWidth: 1, borderColor: C.gold,
            borderStyle: 'dashed',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          {/* deepest ring — subtle metallic vignette */}
          <LinearGradient
            colors={PANEL_GRADIENT}
            start={GRAD_TOP}
            end={GRAD_BOTTOM}
            style={{
              width: 108, height: 108, borderRadius: 54,
              borderWidth: 1, borderColor: 'rgba(201, 168, 117, 0.35)',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 48, color: C.goldBright, textShadowColor: C.gold, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 12 }}>
              ❄
            </Text>
            <Text style={{
              fontFamily: F.mono, fontSize: 7, color: C.gold,
              letterSpacing: 3, textTransform: 'uppercase', marginTop: 4,
              opacity: 0.7,
            }}>
              Certified
            </Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
}

export default function LandingScreen() {
  async function handleStart() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/car-select');
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
      {/* Subtle background grid for depth */}
      <View style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        opacity: 0.05,
      }}>
        {Array.from({ length: 24 }).map((_, i) => (
          <View
            key={`h${i}`}
            style={{
              position: 'absolute', left: 0, right: 0,
              top: i * 40, height: 1,
              backgroundColor: C.gold,
            }}
          />
        ))}
      </View>

      <Animated.View entering={FadeInDown.duration(700).delay(100)} style={{ alignItems: 'center', marginBottom: 40 }}>
        <Text style={{
          fontFamily: F.mono, fontSize: 9, color: C.gold,
          letterSpacing: 6, textTransform: 'uppercase', marginBottom: 18,
          opacity: 0.75,
        }}>
          ·  An Operator Assessment  ·
        </Text>
        <Text style={{
          fontFamily: F.displayBlack, fontSize: 40, color: C.goldBright,
          letterSpacing: 4, textTransform: 'uppercase', textAlign: 'center',
          lineHeight: 48,
          textShadowColor: C.gold, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 18,
        }}>
          Climate{'\n'}Permit
        </Text>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(900).delay(400)}>
        <Seal />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(700).delay(700)} style={{ width: '100%', alignItems: 'center' }}>
        <Text style={{
          fontFamily: F.mono, fontSize: 11, color: C.text,
          textAlign: 'center', lineHeight: 18, opacity: 0.85,
          letterSpacing: 1, marginBottom: 32, paddingHorizontal: 8,
        }}>
          Your driving personality, classified.{'\n'}
          60 seconds. 16 archetypes. Test your partner.
        </Text>

        {/* Premium CTA — metallic gold */}
        <MetalButton onPress={handleStart} style={{ width: '100%' }}>
          <Text style={{
            fontFamily: F.mono, fontSize: 13, color: C.bg,
            fontWeight: 'bold', letterSpacing: 4, textTransform: 'uppercase',
          }}>
            Issue My Permit
          </Text>
        </MetalButton>

        <Text style={{
          fontFamily: F.mono, fontSize: 8, color: C.textMuted,
          textAlign: 'center', marginTop: 18, letterSpacing: 2.5,
          textTransform: 'uppercase', opacity: 0.8,
        }}>
          Results may be accurate · Not valid for aircraft
        </Text>
      </Animated.View>
    </View>
  );
}
