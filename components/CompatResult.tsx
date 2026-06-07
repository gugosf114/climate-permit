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
import { palette as C, glow, goldBevel } from '../constants/tokens';

interface Props {
  myArchetype: Archetype;
  myX: number; myY: number;
  myMake: string; myModel: string; myAnswers: Answers;
  partnerArchetype: Archetype;
  partnerX: number; partnerY: number;
  partnerMake: string; partnerModel: string; partnerAnswers: Answers;
}

export function CompatResult(p: Props) {
  const ref = useRef<ViewShot>(null);
  const score = compatScore(p.myX, p.myY, p.partnerX, p.partnerY);
  const verdict = compatVerdict(score);

  const scoreColor = score >= 60 ? C.goldBright : score >= 40 ? C.gold : C.red;

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
      Share.share({ message: `Our climate compatibility: ${score}% — "${verdict}" climatepermit.app` });
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 48 }}>
        {/* Header */}
        <Animated.View
          entering={FadeIn.duration(500)}
          style={{
            paddingTop: 60, paddingBottom: 16, paddingHorizontal: 24,
            borderBottomWidth: 1, borderBottomColor: C.divider,
          }}
        >
          <Text style={{ fontFamily: 'monospace', fontSize: 9, color: C.gold, opacity: 0.8, textTransform: 'uppercase', letterSpacing: 4 }}>
            Climate Compatibility
          </Text>
          <Text style={{
            fontFamily: 'monospace', fontSize: 22, color: C.goldBright, fontWeight: 'bold',
            textTransform: 'uppercase', letterSpacing: 3, marginTop: 6, ...glow(C.gold, 14),
          }}>
            Assessment
          </Text>
        </Animated.View>

        {/* Shareable card */}
        <ViewShot ref={ref} options={{ format: 'jpg', quality: 0.95 }}>
          <View style={{ backgroundColor: C.bg }}>
            {/* Score block */}
            <Animated.View
              entering={FadeInDown.duration(600).delay(150)}
              style={{
                alignItems: 'center', paddingVertical: 30, paddingHorizontal: 24,
                borderBottomWidth: 1, borderBottomColor: C.divider,
              }}
            >
              <Text style={{ fontFamily: 'monospace', fontSize: 8, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 4 }}>
                Compatibility Index
              </Text>
              <Text
                style={{
                  fontFamily: 'monospace', fontSize: 76, fontWeight: 'bold',
                  color: scoreColor, lineHeight: 84, textAlign: 'center',
                  textShadowColor: scoreColor, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 22,
                }}
              >
                {shown}%
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                <View style={{ width: 24, height: 1, backgroundColor: C.gold, opacity: 0.5 }} />
                <Text style={{
                  fontFamily: 'monospace', fontSize: 12, color: C.red, letterSpacing: 2,
                  textTransform: 'uppercase', textAlign: 'center', marginHorizontal: 10, maxWidth: 240,
                }}>
                  {verdict}
                </Text>
                <View style={{ width: 24, height: 1, backgroundColor: C.gold, opacity: 0.5 }} />
              </View>
            </Animated.View>

            {/* Two permit cards */}
            <View style={{ flexDirection: 'row', paddingHorizontal: 12, paddingTop: 16, gap: 8 }}>
              <Animated.View entering={FadeInDown.duration(500).delay(350)} style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'monospace', fontSize: 8, color: C.gold, opacity: 0.65, textTransform: 'uppercase', textAlign: 'center', letterSpacing: 2, marginBottom: 6 }}>
                  You
                </Text>
                <PermitCard compact archetype={p.myArchetype} make={p.myMake} model={p.myModel} answers={p.myAnswers} />
              </Animated.View>
              <Animated.View entering={FadeInDown.duration(500).delay(500)} style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'monospace', fontSize: 8, color: C.gold, opacity: 0.65, textTransform: 'uppercase', textAlign: 'center', letterSpacing: 2, marginBottom: 6 }}>
                  Partner
                </Text>
                <PermitCard compact archetype={p.partnerArchetype} make={p.partnerMake} model={p.partnerModel} answers={p.partnerAnswers} />
              </Animated.View>
            </View>

            <View style={{ alignItems: 'center', paddingVertical: 18 }}>
              <Text style={{ fontFamily: 'monospace', fontSize: 8, color: C.gold, opacity: 0.5, letterSpacing: 3, textTransform: 'uppercase' }}>
                climatepermit.app
              </Text>
            </View>
          </View>
        </ViewShot>

        {/* Share */}
        <Animated.View entering={FadeIn.duration(500).delay(700)} style={{ paddingHorizontal: 24, paddingTop: 18 }}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleShare}
            style={{
              backgroundColor: C.gold, ...goldBevel,
              paddingVertical: 18, alignItems: 'center',
              shadowColor: C.gold, shadowOpacity: 0.45, shadowRadius: 16, shadowOffset: { width: 0, height: 5 },
            }}
          >
            <Text style={{ fontFamily: 'monospace', fontSize: 12, color: C.bg, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 3 }}>
              Share Results
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
