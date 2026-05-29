import { View, Text } from 'react-native';
import { Archetype } from '../data/archetypes';
import { Answers } from '../lib/store';

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

// Deterministic permit number from archetype id
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

// Fake QR-like block (text art)
const QR_ROWS = [
  '▓▓▓ ░ ▓ ░░░ ▓▓▓',
  '▓ ░ ▓ ░ ▓ ░ ▓ ░',
  '▓▓▓ ░ ░▓░ ░ ▓▓▓',
  '░ ▓ ░▓ ░ ░▓ ░ ░',
  '▓▓▓ ▓ ░ ▓ ▓ ▓▓▓',
];

export function PermitCard({ archetype, make, model, answers, compact = false }: Props) {
  const s = compact ? 0.6 : 1;
  const issueDate = todayIssueDate();

  const T = ({ style, children, ...rest }: any) => (
    <Text style={[{ fontFamily: 'monospace', color: '#1a3a1a' }, style]} {...rest}>
      {children}
    </Text>
  );

  return (
    <View
      style={{
        backgroundColor: '#f4f0e6',
        borderWidth: compact ? 1 : 2,
        borderColor: '#1a3a1a',
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
          opacity: 0.055,
          pointerEvents: 'none',
        }}
      >
        <T style={{ fontSize: compact ? 28 : 46, fontWeight: 'bold', textAlign: 'center', letterSpacing: 10, color: '#1a3a1a' }}>
          CERTIFIED
        </T>
      </View>

      {/* Header */}
      <View style={{ alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#1a3a1a', paddingBottom: compact ? 8 : 12, marginBottom: compact ? 8 : 12 }}>
        <T style={{ fontSize: compact ? 7 : 9, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.55 }}>
          Department of Climate Control
        </T>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: '#1a3a1a' }} />
          <T style={{ fontSize: compact ? 9 : 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 3, marginHorizontal: 8 }}>
            Operator Permit
          </T>
          <View style={{ flex: 1, height: 1, backgroundColor: '#1a3a1a' }} />
        </View>
      </View>

      {/* Permit meta */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: compact ? 8 : 12 }}>
        <View>
          <T style={{ fontSize: compact ? 6 : 8, opacity: 0.5, textTransform: 'uppercase', letterSpacing: 1 }}>Permit No.</T>
          <T style={{ fontSize: compact ? 10 : 14, fontWeight: 'bold', letterSpacing: 1, marginTop: 1 }}>
            {permitNo(archetype.id)}
          </T>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <T style={{ fontSize: compact ? 6 : 8, opacity: 0.5, textTransform: 'uppercase', letterSpacing: 1 }}>Issued</T>
          <T style={{ fontSize: compact ? 8 : 10, marginTop: 1, letterSpacing: 1 }}>{issueDate}</T>
        </View>
      </View>

      {/* Vehicle badge */}
      <View style={{ borderWidth: 1, borderColor: '#1a3a1a', alignItems: 'center', paddingVertical: compact ? 8 : 14, marginBottom: compact ? 8 : 12 }}>
        <Text style={{ fontSize: compact ? 22 : 30 }}>🚗</Text>
        <T style={{ fontSize: compact ? 7 : 9, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.5, marginTop: 2 }}>
          {make}  {model}
        </T>
      </View>

      {/* Classification */}
      <View style={{ alignItems: 'center', marginBottom: compact ? 8 : 12 }}>
        <T style={{ fontSize: compact ? 6 : 8, opacity: 0.5, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>Classification</T>
        <View style={{ backgroundColor: '#1a3a1a', paddingHorizontal: 12, paddingVertical: compact ? 6 : 10, width: '100%', alignItems: 'center' }}>
          <T style={{ fontSize: compact ? 11 : 15, fontWeight: 'bold', color: '#f4f0e6', textTransform: 'uppercase', letterSpacing: compact ? 1 : 2, textAlign: 'center' }}>
            {archetype.name}
          </T>
        </View>
      </View>

      {/* Vehicle + zone */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#1a3a1a', paddingTop: compact ? 6 : 10, marginBottom: compact ? 8 : 10 }}>
        <View>
          <T style={{ fontSize: compact ? 6 : 8, opacity: 0.5, textTransform: 'uppercase', letterSpacing: 1 }}>Vehicle</T>
          <T style={{ fontSize: compact ? 8 : 10, fontWeight: 'bold', textTransform: 'uppercase', marginTop: 1 }}>
            {make} {model}
          </T>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <T style={{ fontSize: compact ? 6 : 8, opacity: 0.5, textTransform: 'uppercase', letterSpacing: 1 }}>Zone Pref.</T>
          <T style={{ fontSize: compact ? 8 : 10, fontWeight: 'bold', textTransform: 'uppercase', marginTop: 1 }}>
            {zoneSummary(answers)}
          </T>
        </View>
      </View>

      {/* Restrictions */}
      <View style={{ borderTopWidth: 1, borderTopColor: '#1a3a1a', paddingTop: compact ? 6 : 10, marginBottom: compact ? 6 : 10 }}>
        <T style={{ fontSize: compact ? 6 : 8, opacity: 0.5, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>
          — Restrictions —
        </T>
        <T style={{ fontSize: compact ? 7 : 8, lineHeight: compact ? 11 : 13 }} numberOfLines={compact ? 4 : 7}>
          {archetype.permitText}
        </T>
      </View>

      {/* Footer */}
      <View style={{ borderTopWidth: 1, borderTopColor: '#1a3a1a', paddingTop: compact ? 6 : 10, alignItems: 'center' }}>
        <T style={{ fontSize: compact ? 6 : 8, color: '#8b2020', fontStyle: 'italic', letterSpacing: 1, marginBottom: compact ? 4 : 8, textAlign: 'center' }}>
          "Issued under penalty of comfort"
        </T>

        {/* Fake QR */}
        <View style={{ borderWidth: 1, borderColor: '#1a3a1a', padding: compact ? 3 : 6, marginBottom: compact ? 3 : 6 }}>
          {QR_ROWS.map((row, i) => (
            <T key={i} style={{ fontSize: compact ? 5 : 7, letterSpacing: 1, opacity: 0.35, textAlign: 'center' }}>
              {row}
            </T>
          ))}
        </View>

        <T style={{ fontSize: compact ? 6 : 8, textTransform: 'uppercase', letterSpacing: 2, opacity: 0.55 }}>
          CLIMATEPERMIT.APP
        </T>
      </View>
    </View>
  );
}
