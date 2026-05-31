import { View, Text, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, FadeIn, FadeInDown } from 'react-native-reanimated';

const C = {
  bg:        '#0a0e14',
  bg2:       '#14191f',
  bg3:       '#1f262e',
  surface:   'rgba(255, 248, 232, 0.04)',
  gold:      '#c9a875',
  goldBright:'#e8c98a',
  goldDim:   '#5a4730',
  goldShadow:'rgba(201, 168, 117, 0.4)',
  text:      '#f0e9d8',
  textDim:   '#a8a193',
  textMuted: '#6b6760',
  border:    'rgba(201, 168, 117, 0.25)',
  borderHi:  'rgba(232, 201, 138, 0.55)',
  divider:   'rgba(201, 168, 117, 0.12)',
};

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
          {/* deepest ring */}
          <View
            style={{
              width: 108, height: 108, borderRadius: 54,
              borderWidth: 1, borderColor: 'rgba(201, 168, 117, 0.35)',
              alignItems: 'center', justifyContent: 'center',
              backgroundColor: C.bg,
            }}
          >
            <Text style={{ fontSize: 48, color: C.goldBright, textShadowColor: C.gold, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 12 }}>
              ❄
            </Text>
            <Text style={{
              fontFamily: 'monospace', fontSize: 7, color: C.gold,
              letterSpacing: 3, textTransform: 'uppercase', marginTop: 4,
              opacity: 0.7,
            }}>
              Certified
            </Text>
          </View>
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
          fontFamily: 'monospace', fontSize: 9, color: C.gold,
          letterSpacing: 6, textTransform: 'uppercase', marginBottom: 16,
          opacity: 0.75,
        }}>
          ·  An Operator Assessment  ·
        </Text>
        <Text style={{
          fontFamily: 'monospace', fontSize: 38, color: C.goldBright,
          letterSpacing: 8, textTransform: 'uppercase', textAlign: 'center',
          fontWeight: 'bold', lineHeight: 44,
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
          fontFamily: 'monospace', fontSize: 11, color: C.text,
          textAlign: 'center', lineHeight: 18, opacity: 0.85,
          letterSpacing: 1, marginBottom: 32, paddingHorizontal: 8,
        }}>
          Your driving personality, classified.{'\n'}
          60 seconds. 16 archetypes. Test your partner.
        </Text>

        {/* Premium CTA — embossed gold */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handleStart}
          style={{
            width: '100%',
            paddingVertical: 18,
            alignItems: 'center',
            backgroundColor: C.gold,
            borderTopColor: C.goldBright, borderLeftColor: C.goldBright,
            borderBottomColor: '#8a7250', borderRightColor: '#8a7250',
            borderWidth: 1.5,
            shadowColor: C.gold, shadowOpacity: 0.55, shadowRadius: 18, shadowOffset: { width: 0, height: 6 },
          }}
        >
          <Text style={{
            fontFamily: 'monospace', fontSize: 13, color: C.bg,
            fontWeight: 'bold', letterSpacing: 4, textTransform: 'uppercase',
          }}>
            Issue My Permit
          </Text>
        </TouchableOpacity>

        <Text style={{
          fontFamily: 'monospace', fontSize: 8, color: C.textMuted,
          textAlign: 'center', marginTop: 18, letterSpacing: 2.5,
          textTransform: 'uppercase', opacity: 0.8,
        }}>
          Results may be accurate · Not valid for aircraft
        </Text>
      </Animated.View>
    </View>
  );
}
