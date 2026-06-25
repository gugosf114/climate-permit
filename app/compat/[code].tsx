import { View, Text } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { decodePayload, CompatPayload } from '../../lib/encode';
import { useClimateStore } from '../../lib/store';
import { loadAndShowInterstitial } from '../../lib/ads';
import { CompatResult } from '../../components/CompatResult';
import { ARCHETYPES } from '../../data/archetypes';
import { C, F } from '../../constants/palette';
import { MetalButton } from '../../components/ui/gold';

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
      <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <Text style={{ fontFamily: F.display, fontSize: 18, color: C.red, textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center', marginBottom: 20 }}>
          Invalid Permit Link
        </Text>
        <MetalButton onPress={() => router.replace('/')} style={{ width: '100%' }}>
          <Text style={{ fontFamily: F.mono, fontSize: 12, color: C.bg, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2.5 }}>
            Get Your Own Permit
          </Text>
        </MetalButton>
      </View>
    );
  }

  // Partner has a code but current user hasn't taken quiz yet
  if (!store.archetypeId && partnerPayload) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <Text style={{ fontFamily: F.mono, fontSize: 9, color: C.gold, opacity: 0.75, textTransform: 'uppercase', letterSpacing: 4, marginBottom: 12, textAlign: 'center' }}>
          Your partner has challenged you
        </Text>
        <Text style={{
          fontFamily: F.display, fontSize: 26, color: C.goldBright, textTransform: 'uppercase',
          letterSpacing: 2, textAlign: 'center', marginBottom: 10, lineHeight: 32,
          textShadowColor: C.gold, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 16,
        }}>
          Take the Quiz First
        </Text>
        <Text style={{ fontFamily: F.mono, fontSize: 10, color: C.text, opacity: 0.7, textAlign: 'center', lineHeight: 17, marginBottom: 34 }}>
          Their permit is locked until you complete your own climate configuration. Your results will be compared automatically.
        </Text>

        {/* Partner's archetype teaser */}
        {partnerPayload && (
          <View style={{ borderWidth: 1, borderColor: C.border, paddingVertical: 14, paddingHorizontal: 20, marginBottom: 34, width: '100%', alignItems: 'center', backgroundColor: C.bg2 }}>
            <Text style={{ fontFamily: F.mono, fontSize: 8, color: C.gold, opacity: 0.6, textTransform: 'uppercase', letterSpacing: 2 }}>
              Partner classified as
            </Text>
            <Text style={{ fontFamily: F.display, fontSize: 16, color: C.red, textTransform: 'uppercase', letterSpacing: 3, marginTop: 6 }}>
              ???
            </Text>
            <Text style={{ fontFamily: F.mono, fontSize: 8, color: C.textMuted, marginTop: 4, letterSpacing: 1 }}>
              Reveal after your quiz
            </Text>
          </View>
        )}

        <MetalButton onPress={() => router.push('/car-select')} style={{ width: '100%' }}>
          <Text style={{ fontFamily: F.mono, fontSize: 12, color: C.bg, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 3 }}>
            Start My Quiz
          </Text>
        </MetalButton>
      </View>
    );
  }

  // Waiting for ad + result
  if (!showResult || !partnerPayload) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: F.mono, fontSize: 11, color: C.gold, textTransform: 'uppercase', letterSpacing: 4, opacity: 0.7 }}>
          Calculating...
        </Text>
      </View>
    );
  }

  const myArchetype = ARCHETYPES.find((a) => a.id === store.archetypeId)!;
  const partnerArchetype = ARCHETYPES.find((a) => a.id === partnerPayload.archetypeId)!;

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
