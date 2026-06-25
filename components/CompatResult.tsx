import { View, Text, ScrollView, Share } from 'react-native';
import { useRef } from 'react';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { PermitCard } from './PermitCard';
import { Archetype } from '../data/archetypes';
import { Answers } from '../lib/store';
import { compatScore, compatVerdict } from '../lib/encode';
import { C, F } from '../constants/palette';
import { MetalButton } from './ui/gold';

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

  // Stay inside the dark-gold identity: strong match glows bright gold,
  // a poor match flares red, the middle sits in plain gold.
  const scoreColor = score >= 60 ? C.goldBright : score >= 40 ? C.gold : C.red;

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
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 60 }}>
      <View style={{ paddingTop: 60, paddingBottom: 16, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: C.divider }}>
        <Text style={{ fontFamily: F.mono, fontSize: 9, color: C.gold, opacity: 0.8, textTransform: 'uppercase', letterSpacing: 4 }}>
          Climate Compatibility
        </Text>
        <Text style={{
          fontFamily: F.display, fontSize: 24, color: C.goldBright,
          textTransform: 'uppercase', letterSpacing: 2, marginTop: 8,
          textShadowColor: C.gold, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 14,
        }}>
          Assessment
        </Text>
      </View>

      <ViewShot ref={ref} options={{ format: 'jpg', quality: 0.95 }}>
        <View style={{ backgroundColor: C.bg }}>
          {/* Score block */}
          <View style={{ alignItems: 'center', paddingVertical: 34, borderBottomWidth: 1, borderBottomColor: C.divider }}>
            <Text style={{
              fontFamily: F.display, fontSize: 72, color: scoreColor, lineHeight: 78,
              textShadowColor: scoreColor, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20,
            }}>
              {score}%
            </Text>
            <Text style={{
              fontFamily: F.mono, fontSize: 12, color: C.text, letterSpacing: 2,
              textTransform: 'uppercase', textAlign: 'center', paddingHorizontal: 32, marginTop: 8, opacity: 0.9,
            }}>
              {verdict}
            </Text>
          </View>

          {/* Two cards */}
          <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingTop: 18, gap: 8 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: F.mono, fontSize: 8, color: C.gold, opacity: 0.7, textTransform: 'uppercase', textAlign: 'center', letterSpacing: 2, marginBottom: 6 }}>
                You
              </Text>
              <PermitCard compact archetype={p.myArchetype} make={p.myMake} model={p.myModel} answers={p.myAnswers} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: F.mono, fontSize: 8, color: C.gold, opacity: 0.7, textTransform: 'uppercase', textAlign: 'center', letterSpacing: 2, marginBottom: 6 }}>
                Partner
              </Text>
              <PermitCard compact archetype={p.partnerArchetype} make={p.partnerMake} model={p.partnerModel} answers={p.partnerAnswers} />
            </View>
          </View>

          <View style={{ alignItems: 'center', paddingVertical: 18 }}>
            <Text style={{ fontFamily: F.mono, fontSize: 8, color: C.gold, opacity: 0.6, letterSpacing: 3, textTransform: 'uppercase' }}>
              CLIMATEPERMIT.APP
            </Text>
          </View>
        </View>
      </ViewShot>

      <View style={{ paddingHorizontal: 24, paddingTop: 18 }}>
        <MetalButton onPress={handleShare}>
          <Text style={{ fontFamily: F.mono, fontSize: 12, color: C.bg, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 3 }}>
            Share Results
          </Text>
        </MetalButton>
      </View>
    </ScrollView>
  );
}
