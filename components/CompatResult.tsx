import { View, Text, ScrollView, TouchableOpacity, Share } from 'react-native';
import { useRef } from 'react';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { PermitCard } from './PermitCard';
import { Archetype } from '../data/archetypes';
import { Answers } from '../lib/store';
import { compatScore, compatVerdict } from '../lib/encode';

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

  const scoreColor = score >= 60 ? '#1a3a1a' : score >= 40 ? '#8b5a00' : '#8b2020';

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
    <ScrollView style={{ flex: 1, backgroundColor: '#f4f0e6' }} contentContainerStyle={{ paddingBottom: 60 }}>
      <View style={{ paddingTop: 60, paddingBottom: 14, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#1a3a1a' }}>
        <Text style={{ fontFamily: 'monospace', fontSize: 9, color: '#1a3a1a', opacity: 0.5, textTransform: 'uppercase', letterSpacing: 2 }}>
          Climate Compatibility
        </Text>
        <Text style={{ fontFamily: 'monospace', fontSize: 20, color: '#1a3a1a', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginTop: 4 }}>
          Assessment
        </Text>
      </View>

      <ViewShot ref={ref} options={{ format: 'jpg', quality: 0.95 }}>
        <View style={{ backgroundColor: '#f4f0e6' }}>
          {/* Score block */}
          <View style={{ alignItems: 'center', paddingVertical: 32, borderBottomWidth: 1, borderBottomColor: '#1a3a1a' }}>
            <Text style={{ fontFamily: 'monospace', fontSize: 72, fontWeight: 'bold', color: scoreColor, lineHeight: 76 }}>
              {score}%
            </Text>
            <Text style={{ fontFamily: 'monospace', fontSize: 13, color: '#8b2020', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', paddingHorizontal: 32, marginTop: 6 }}>
              {verdict}
            </Text>
          </View>

          {/* Two cards */}
          <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingTop: 16, gap: 8 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'monospace', fontSize: 8, color: '#1a3a1a', opacity: 0.45, textTransform: 'uppercase', textAlign: 'center', letterSpacing: 1, marginBottom: 6 }}>
                You
              </Text>
              <PermitCard compact archetype={p.myArchetype} make={p.myMake} model={p.myModel} answers={p.myAnswers} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'monospace', fontSize: 8, color: '#1a3a1a', opacity: 0.45, textTransform: 'uppercase', textAlign: 'center', letterSpacing: 1, marginBottom: 6 }}>
                Partner
              </Text>
              <PermitCard compact archetype={p.partnerArchetype} make={p.partnerMake} model={p.partnerModel} answers={p.partnerAnswers} />
            </View>
          </View>

          <View style={{ alignItems: 'center', paddingVertical: 16 }}>
            <Text style={{ fontFamily: 'monospace', fontSize: 8, color: '#1a3a1a', opacity: 0.35, letterSpacing: 1 }}>
              CLIMATEPERMIT.APP
            </Text>
          </View>
        </View>
      </ViewShot>

      <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
        <TouchableOpacity
          style={{ backgroundColor: '#1a3a1a', paddingVertical: 18, alignItems: 'center' }}
          onPress={handleShare}
          activeOpacity={0.85}
        >
          <Text style={{ fontFamily: 'monospace', fontSize: 12, color: '#f4f0e6', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 3 }}>
            Share Results
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
