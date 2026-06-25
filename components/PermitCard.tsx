import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { Archetype } from '../data/archetypes';
import { Answers } from '../lib/store';
import { getVehicleImage } from '../lib/vehicleImages';
import { useTheme, F } from '../constants/palette';
import { GoldSurface } from './ui/gold';
import { PermitQR } from './ui/permit-qr';
import { PLAY_STORE_URL } from '../lib/config';

interface Props {
  archetype: Archetype;
  make: string;
  model: string;
  answers: Answers;
  compact?: boolean;
}

function zoneSummary(answers: Answers): string {
  const parts: string[] = [];
  if (answers.driverTemp) parts.push(`${answers.driverTemp}°F`);
  if (answers.fanSpeed) parts.push(`FAN ${String(answers.fanSpeed).toUpperCase()}`);
  if (answers.climateMode) parts.push(answers.climateMode.toUpperCase());
  return parts.join(' / ') || 'DEFAULT';
}

function permitNo(archetypeId: string): string {
  let hash = 0;
  for (let i = 0; i < archetypeId.length; i++) hash = ((hash << 5) - hash + archetypeId.charCodeAt(i)) | 0;
  const num = Math.abs(hash % 9000) + 1000;
  const letters = 'ABCDEFGHJKMNP';
  const letter = letters[Math.abs(hash) % letters.length];
  return `${num}-${letter}`;
}

function todayIssueDate(): string {
  return new Date()
    .toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    .toUpperCase();
}


export function PermitCard({ archetype, make, model, answers, compact = false }: Props) {
  const C = useTheme();
  const issueDate = todayIssueDate();

  const T = ({ style, children, ...rest }: any) => (
    <Text style={[{ fontFamily: 'monospace', color: C.text }, style]} {...rest}>
      {children}
    </Text>
  );

  return (
    <View
      style={{
        backgroundColor: C.bg2,
        borderTopColor: C.cardLight, borderLeftColor: C.cardLight,
        borderBottomColor: C.cardDark, borderRightColor: C.cardDark,
        borderWidth: compact ? 1 : 2,
        padding: compact ? 12 : 20,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Watermark */}
      <View
        style={{
          position: 'absolute',
          top: '28%', left: '-10%', right: '-10%',
          transform: [{ rotate: '-28deg' }],
          opacity: 0.06,
          pointerEvents: 'none',
        }}
      >
        <T style={{ fontSize: compact ? 28 : 46, fontWeight: 'bold', textAlign: 'center', letterSpacing: 10, color: C.gold }}>
          CERTIFIED
        </T>
      </View>

      {/* Top gold rule + wordmark */}
      <View style={{
        alignItems: 'center',
        borderBottomWidth: 1, borderBottomColor: C.divider,
        paddingBottom: compact ? 8 : 12, marginBottom: compact ? 10 : 14,
      }}>
        <T style={{
          fontSize: compact ? 7 : 9, color: C.gold,
          letterSpacing: 4, textTransform: 'uppercase', opacity: 0.85,
        }}>
          Operator Authorization
        </T>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: C.gold, opacity: 0.5 }} />
          <T style={{
            fontFamily: F.display,
            fontSize: compact ? 12 : 15,
            textTransform: 'uppercase', letterSpacing: compact ? 1.5 : 2.5, marginHorizontal: 10,
            color: C.goldBright,
            textShadowColor: C.gold, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8,
          }}>
            Climate Permit
          </T>
          <View style={{ flex: 1, height: 1, backgroundColor: C.gold, opacity: 0.5 }} />
        </View>
      </View>

      {/* Permit meta */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: compact ? 8 : 12 }}>
        <View>
          <T style={{ fontSize: compact ? 6 : 8, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 2 }}>Permit No.</T>
          <T style={{ fontSize: compact ? 10 : 14, fontWeight: 'bold', letterSpacing: 1.5, marginTop: 2, color: C.goldBright }}>
            {permitNo(archetype.id)}
          </T>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <T style={{ fontSize: compact ? 6 : 8, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 2 }}>Issued</T>
          <T style={{ fontSize: compact ? 8 : 10, marginTop: 2, letterSpacing: 1.5, color: C.text }}>{issueDate}</T>
        </View>
      </View>

      {/* Vehicle badge */}
      <View style={{
        borderWidth: 1, borderColor: C.divider,
        alignItems: 'center', paddingVertical: compact ? 8 : 12,
        paddingHorizontal: compact ? 12 : 16,
        marginBottom: compact ? 10 : 14,
        backgroundColor: C.bg,
      }}>
        <Image
          source={getVehicleImage(make, model)}
          style={{ width: '100%', aspectRatio: 1536 / 1024, maxHeight: compact ? 80 : 130 }}
          contentFit="contain"
        />
        <T style={{
          fontSize: compact ? 7 : 9, textTransform: 'uppercase', letterSpacing: 2,
          color: C.gold, marginTop: 4, opacity: 0.85,
        }}>
          {make}  ·  {model}
        </T>
      </View>

      {/* Classification — featured gold bar */}
      <View style={{ alignItems: 'center', marginBottom: compact ? 10 : 14 }}>
        <T style={{ fontSize: compact ? 6 : 8, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 6 }}>
          Classification
        </T>
        <GoldSurface style={{
          paddingHorizontal: 14, paddingVertical: compact ? 8 : 12,
          width: '100%', alignItems: 'center',
          shadowColor: C.gold, shadowOpacity: 0.5, shadowRadius: 14, shadowOffset: { width: 0, height: 0 },
        }}>
          <T style={{
            fontFamily: F.display,
            fontSize: compact ? 11 : 15, color: C.bg,
            textTransform: 'uppercase', letterSpacing: compact ? 0.5 : 1,
            lineHeight: compact ? 15 : 20, textAlign: 'center',
          }}>
            {archetype.name}
          </T>
        </GoldSurface>
      </View>

      {/* Vehicle + zone */}
      <View style={{
        flexDirection: 'row', justifyContent: 'space-between',
        borderTopWidth: 1, borderTopColor: C.divider,
        paddingTop: compact ? 8 : 12, marginBottom: compact ? 8 : 12,
      }}>
        <View>
          <T style={{ fontSize: compact ? 6 : 8, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 2 }}>Vehicle</T>
          <T style={{ fontSize: compact ? 8 : 10, fontWeight: 'bold', textTransform: 'uppercase', marginTop: 2, letterSpacing: 1, color: C.text }}>
            {make} {model}
          </T>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <T style={{ fontSize: compact ? 6 : 8, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 2 }}>Zone Pref.</T>
          <T style={{ fontSize: compact ? 8 : 10, fontWeight: 'bold', textTransform: 'uppercase', marginTop: 2, letterSpacing: 1, color: C.goldBright }}>
            {zoneSummary(answers)}
          </T>
        </View>
      </View>

      {/* Restrictions */}
      <View style={{ borderTopWidth: 1, borderTopColor: C.divider, paddingTop: compact ? 8 : 12, marginBottom: compact ? 8 : 12 }}>
        <T style={{ fontSize: compact ? 6 : 8, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 6 }}>
          —  Restrictions  —
        </T>
        <T style={{ fontSize: compact ? 7 : 9, lineHeight: compact ? 12 : 15, color: C.text, opacity: 0.92 }} numberOfLines={compact ? 4 : 7}>
          {archetype.permitText}
        </T>
      </View>

      {/* Footer */}
      <View style={{ borderTopWidth: 1, borderTopColor: C.divider, paddingTop: compact ? 8 : 12, alignItems: 'center' }}>
        <T style={{ fontSize: compact ? 6 : 8, color: C.red, fontStyle: 'italic', letterSpacing: 1.5, marginBottom: compact ? 6 : 10, textAlign: 'center', opacity: 0.85 }}>
          "Issued under penalty of comfort"
        </T>

        <View style={{ marginBottom: compact ? 6 : 8 }}>
          <PermitQR value={PLAY_STORE_URL} size={compact ? 44 : 64} />
        </View>

        <T style={{ fontSize: compact ? 6 : 8, color: C.gold, textTransform: 'uppercase', letterSpacing: 3, opacity: 0.75 }}>
          CLIMATEPERMIT.APP
        </T>
      </View>
    </View>
  );
}
