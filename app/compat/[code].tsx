import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { decodePayload, CompatPayload } from '../../lib/encode';
import { useClimateStore } from '../../lib/store';
import { loadAndShowInterstitial } from '../../lib/ads';
import { CompatResult } from '../../components/CompatResult';
import { ARCHETYPES } from '../../data/archetypes';
// DMV paper palette — matches landing/car-select/dashboard/result/PermitCard
const DMV = {
  paper:       '#f5efde',
  paperLight:  '#fbf6e6',
  border:      '#8a7a3a',
  caBlue:      '#0e2d63',
  caBlueSoft:  '#1e4385',
  caBlueDeep:  '#081c44',
  ink:         '#0a0a0a',
  inkSoft:     '#2c2c2c',
  inkDim:      '#7a7a7a',
  red:         '#b41d23',
};

export default function CompatScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const store = useClimateStore();
  const [partnerPayload, setPartnerPayload] = useState<CompatPayload | null>(null);
  const [adShown, setAdShown] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (!code) { setInvalid(true); return; }
    const decoded = decodePayload(code);
    if (!decoded) { setInvalid(true); return; }
    setPartnerPayload(decoded);
    store.setCompatPayload(code);
  }, [code]);

  useEffect(() => {
    if (store.archetypeId && partnerPayload && !adShown) {
      setAdShown(true);
      loadAndShowInterstitial().then(() => setShowResult(true));
    }
  }, [store.archetypeId, partnerPayload]);

  if (invalid) {
    return (
      <View style={{ flex: 1, backgroundColor: DMV.paper, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <Animated.View entering={FadeIn.duration(400)} style={{ alignItems: 'center', width: '100%' }}>
          <Text style={{
            fontFamily: 'monospace', fontSize: 14, color: DMV.red, textTransform: 'uppercase',
            letterSpacing: 2, textAlign: 'center', marginBottom: 20
          }}>
            Invalid Permit Link
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: DMV.caBlue, borderWidth: 1.5, borderColor: DMV.caBlueDeep, paddingVertical: 16, paddingHorizontal: 32 }}
            onPress={() => router.replace('/')}
            activeOpacity={0.88}
          >
            <Text style={{ fontFamily: 'monospace', fontSize: 11, color: DMV.paperLight, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 }}>
              Get Your Own Permit
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  // Partner has a code but current user hasn't taken quiz yet
  if (!store.archetypeId && partnerPayload) {
    return (
      <View style={{ flex: 1, backgroundColor: DMV.paper, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <Animated.View entering={FadeInDown.duration(600)} style={{ alignItems: 'center', width: '100%' }}>
          <Text style={{ fontFamily: 'monospace', fontSize: 9, color: DMV.caBlueSoft, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 8, textAlign: 'center' }}>
            Your partner has challenged you
          </Text>
          <Text style={{
            fontFamily: 'monospace', fontSize: 20, fontWeight: 'bold', color: DMV.caBlue,
            textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center', marginBottom: 8
          }}>
            Take the Quiz First
          </Text>
          <Text style={{ fontFamily: 'monospace', fontSize: 10, color: DMV.ink, opacity: 0.7, textAlign: 'center', lineHeight: 17, marginBottom: 28 }}>
            Their permit is locked until you complete your own climate configuration. Your results will be compared automatically.
          </Text>

          {/* Partner's archetype teaser */}
          <View style={{
            borderWidth: 1, borderColor: DMV.border, paddingVertical: 14, paddingHorizontal: 20,
            marginBottom: 28, width: '100%', alignItems: 'center', backgroundColor: DMV.paperLight,
          }}>
            <Text style={{ fontFamily: 'monospace', fontSize: 8, color: DMV.inkDim, textTransform: 'uppercase', letterSpacing: 1 }}>
              Partner classified as
            </Text>
            <Text style={{
              fontFamily: 'monospace', fontSize: 16, fontWeight: 'bold', color: DMV.red,
              textTransform: 'uppercase', letterSpacing: 3, marginTop: 4
            }}>
              ? ? ?
            </Text>
            <Text style={{ fontFamily: 'monospace', fontSize: 8, color: DMV.inkSoft, marginTop: 4, letterSpacing: 1 }}>
              Reveal after your quiz
            </Text>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: DMV.caBlue, borderWidth: 1.5, borderColor: DMV.caBlueDeep, paddingVertical: 18, width: '100%', alignItems: 'center',
            }}
            onPress={() => router.push('/car-select')}
            activeOpacity={0.88}
          >
            <Text style={{ fontFamily: 'monospace', fontSize: 12, color: DMV.paperLight, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 3 }}>
              Start My Quiz
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  // Waiting for ad + result
  if (!showResult || !partnerPayload) {
    return (
      <View style={{ flex: 1, backgroundColor: DMV.paper, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: 'monospace', fontSize: 11, color: DMV.caBlue, textTransform: 'uppercase', letterSpacing: 4, opacity: 0.7 }}>
          Calculating…
        </Text>
      </View>
    );
  }

  const myArchetype = ARCHETYPES.find((a) => a.id === store.archetypeId);
  const partnerArchetype = ARCHETYPES.find((a) => a.id === partnerPayload.archetypeId);
  if (!myArchetype || !partnerArchetype) {
    // Tampered/garbled payload that survived decode — treat like a bad link.
    return (
      <View style={{ flex: 1, backgroundColor: DMV.paper, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <Text style={{
          fontFamily: 'monospace', fontSize: 14, color: DMV.red, textTransform: 'uppercase',
          letterSpacing: 2, textAlign: 'center'
        }}>
          Invalid Permit Link
        </Text>
      </View>
    );
  }

  return (
    <CompatResult
      myArchetype={myArchetype}
      myX={store.xScore} myY={store.yScore}
      myMake={store.make} myModel={store.model}
      myAnswers={store.answers}
      partnerArchetype={partnerArchetype}
      partnerX={partnerPayload.x} partnerY={partnerPayload.y}
      partnerMake={partnerPayload.make} partnerModel={partnerPayload.model}
      partnerAnswers={partnerPayload.answers as any}
    />
  );
}
