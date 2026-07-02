import { View, Text, ScrollView, TouchableOpacity, Share } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { PermitCard } from './PermitCard';
import { Archetype } from '../data/archetypes';
import { Answers } from '../lib/store';
import { compatScore, compatVerdict } from '../lib/encode';
import { PLAY_STORE_URL } from '../lib/config';
import { useDMV } from '../constants/tokens';

// DMV paper palette — matches landing/car-select/dashboard/result/PermitCard

interface Props {
  myArchetype: Archetype;
  myX: number; myY: number;
  myMake: string; myModel: string; myAnswers: Answers;
  partnerArchetype: Archetype;
  partnerX: number; partnerY: number;
  partnerMake: string; partnerModel: string; partnerAnswers: Answers;
}

export function CompatResult(p: Props) {
  const DMV = useDMV();
  const ref = useRef<ViewShot>(null);
  const score = compatScore(p.myX, p.myY, p.partnerX, p.partnerY);
  const verdict = compatVerdict(score);

  const scoreColor = score >= 60 ? DMV.caBlue : score >= 40 ? DMV.gold : DMV.red;

  // Signature moment: the index counts up from 0 (easeOutCubic) on reveal.
  // Plain rAF + state so it renders reliably on any device / New Architecture.
  const [shown, setShown] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = Date.now();
    const dur = 1150;
    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(eased * score));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  async function handleShare() {
    try {
      const uri = await (ref.current as any)?.capture?.();
      if (!uri) throw new Error('no uri');
      const dest = FileSystem.cacheDirectory + 'compat_result.jpg';
      await FileSystem.copyAsync({ from: uri, to: dest });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(dest, { mimeType: 'image/jpeg' });
      } else {
        throw new Error('sharing unavailable');
      }
    } catch {
      Share.share({ message: `Our climate compatibility: ${score}% — "${verdict}" Get your permit: ${PLAY_STORE_URL}` });
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: DMV.paper }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 48 }}>
        {/* Header */}
        <Animated.View
          entering={FadeIn.duration(500)}
          style={{
            paddingTop: 60, paddingBottom: 16, paddingHorizontal: 24,
            borderBottomWidth: 1, borderBottomColor: DMV.divider,
          }}
        >
          <Text style={{ fontFamily: 'monospace', fontSize: 9, color: DMV.caBlueSoft, textTransform: 'uppercase', letterSpacing: 4 }}>
            Climate Compatibility
          </Text>
          <Text style={{
            fontFamily: 'monospace', fontSize: 22, color: DMV.caBlue, fontWeight: 'bold',
            textTransform: 'uppercase', letterSpacing: 3, marginTop: 6,
          }}>
            Assessment
          </Text>
        </Animated.View>

        {/* Shareable card */}
        <ViewShot ref={ref} options={{ format: 'jpg', quality: 0.95 }}>
          <View style={{ backgroundColor: DMV.paper }}>
            {/* Score block */}
            <Animated.View
              entering={FadeInDown.duration(600).delay(150)}
              style={{
                alignItems: 'center', paddingVertical: 30, paddingHorizontal: 24,
                borderBottomWidth: 1, borderBottomColor: DMV.divider,
              }}
            >
              <Text style={{ fontFamily: 'monospace', fontSize: 8, color: DMV.inkDim, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 4 }}>
                Compatibility Index
              </Text>
              <Text
                style={{
                  fontFamily: 'monospace', fontSize: 76, fontWeight: 'bold',
                  color: scoreColor, lineHeight: 84, textAlign: 'center',
                }}
              >
                {shown}%
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                <View style={{ width: 24, height: 1, backgroundColor: DMV.border, opacity: 0.7 }} />
                <Text style={{
                  fontFamily: 'monospace', fontSize: 12, color: DMV.red, letterSpacing: 2,
                  textTransform: 'uppercase', textAlign: 'center', marginHorizontal: 10, maxWidth: 240,
                }}>
                  {verdict}
                </Text>
                <View style={{ width: 24, height: 1, backgroundColor: DMV.border, opacity: 0.7 }} />
              </View>
            </Animated.View>

            {/* Two permit cards */}
            <View style={{ flexDirection: 'row', paddingHorizontal: 12, paddingTop: 16, gap: 8 }}>
              <Animated.View entering={FadeInDown.duration(500).delay(350)} style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'monospace', fontSize: 8, color: DMV.caBlue, opacity: 0.85, textTransform: 'uppercase', textAlign: 'center', letterSpacing: 2, marginBottom: 6 }}>
                  You
                </Text>
                <PermitCard compact archetype={p.myArchetype} make={p.myMake} model={p.myModel} answers={p.myAnswers} />
              </Animated.View>
              <Animated.View entering={FadeInDown.duration(500).delay(500)} style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'monospace', fontSize: 8, color: DMV.caBlue, opacity: 0.85, textTransform: 'uppercase', textAlign: 'center', letterSpacing: 2, marginBottom: 6 }}>
                  Partner
                </Text>
                <PermitCard compact archetype={p.partnerArchetype} make={p.partnerMake} model={p.partnerModel} answers={p.partnerAnswers} />
              </Animated.View>
            </View>

            <View style={{ alignItems: 'center', paddingVertical: 18 }}>
              <Text style={{ fontFamily: 'monospace', fontSize: 8, color: DMV.inkDim, letterSpacing: 3, textTransform: 'uppercase' }}>
                CLIMATE PERMIT · GET YOURS ON GOOGLE PLAY
              </Text>
            </View>
          </View>
        </ViewShot>

        {/* Share */}
        <Animated.View entering={FadeIn.duration(500).delay(700)} style={{ paddingHorizontal: 24, paddingTop: 18 }}>
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.88}
            onPress={handleShare}
            style={{
              backgroundColor: DMV.caBlue,
              paddingVertical: 18, alignItems: 'center',
              borderWidth: 1.5, borderColor: DMV.caBlueDeep,
            }}
          >
            <Text style={{ fontFamily: 'monospace', fontSize: 12, color: DMV.paperLight, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 3 }}>
              Share Results
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
