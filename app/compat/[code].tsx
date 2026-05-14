import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { decodePayload, CompatPayload } from '../../lib/encode';
import { useClimateStore } from '../../lib/store';
import { loadAndShowInterstitial } from '../../lib/ads';
import { CompatResult } from '../../components/CompatResult';
import { ARCHETYPES } from '../../data/archetypes';

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
      <View style={{ flex: 1, backgroundColor: '#f4f0e6', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <Text style={{ fontFamily: 'monospace', fontSize: 14, color: '#8b2020', textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center', marginBottom: 16 }}>
          Invalid Permit Link
        </Text>
        <TouchableOpacity
          style={{ backgroundColor: '#1a3a1a', paddingVertical: 14, paddingHorizontal: 32 }}
          onPress={() => router.replace('/')}
        >
          <Text style={{ fontFamily: 'monospace', fontSize: 11, color: '#f4f0e6', textTransform: 'uppercase', letterSpacing: 2 }}>
            Get Your Own Permit
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Partner has a code but current user hasn't taken quiz yet
  if (!store.archetypeId && partnerPayload) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f4f0e6', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <Text style={{ fontFamily: 'monospace', fontSize: 9, color: '#1a3a1a', opacity: 0.5, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8, textAlign: 'center' }}>
          Your partner has challenged you
        </Text>
        <Text style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 'bold', color: '#1a3a1a', textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center', marginBottom: 6 }}>
          Take the Quiz First
        </Text>
        <Text style={{ fontFamily: 'monospace', fontSize: 10, color: '#1a3a1a', opacity: 0.55, textAlign: 'center', lineHeight: 17, marginBottom: 32 }}>
          Their permit is locked until you complete your own climate configuration. Your results will be compared automatically.
        </Text>

        {/* Partner's archetype teaser */}
        {partnerPayload && (
          <View style={{ borderWidth: 1, borderColor: '#1a3a1a', paddingVertical: 12, paddingHorizontal: 20, marginBottom: 32, width: '100%', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'monospace', fontSize: 8, color: '#1a3a1a', opacity: 0.5, textTransform: 'uppercase', letterSpacing: 1 }}>
              Partner classified as
            </Text>
            <Text style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 'bold', color: '#8b2020', textTransform: 'uppercase', letterSpacing: 2, marginTop: 4 }}>
              ???
            </Text>
            <Text style={{ fontFamily: 'monospace', fontSize: 8, color: '#1a3a1a', opacity: 0.4, marginTop: 2 }}>
              Reveal after your quiz
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={{ backgroundColor: '#1a3a1a', paddingVertical: 18, width: '100%', alignItems: 'center' }}
          onPress={() => router.push('/car-select')}
          activeOpacity={0.85}
        >
          <Text style={{ fontFamily: 'monospace', fontSize: 12, color: '#f4f0e6', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 3 }}>
            Start My Quiz
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Waiting for ad + result
  if (!showResult || !partnerPayload) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f4f0e6', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: 'monospace', fontSize: 11, color: '#1a3a1a', textTransform: 'uppercase', letterSpacing: 3, opacity: 0.5 }}>
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
