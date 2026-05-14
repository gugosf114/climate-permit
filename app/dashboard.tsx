import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { DashboardKnob } from '../components/DashboardKnob';
import { useClimateStore, Answers } from '../lib/store';
import { pickArchetype } from '../lib/scoring';

const TEMP_STEPS = [60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80];
const FAN_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', 'AUTO'];
const VENT_OPTIONS = ['FACE', 'FEET', 'DEFROST', 'MIX'];
const RECIRC_OPTIONS = ['ON', 'OFF', 'AUTO'];
const AC_OPTIONS = ['ON', 'OFF', 'AUTO'];
const MODE_OPTIONS = ['AUTO', 'MANUAL'];
const REAR_OPTIONS = ['OPEN', 'CLOSED', 'WHAT REAR VENTS?'];
const SEATS_OPTIONS = ['ALWAYS', 'SOMETIMES', 'NEVER'];
const PRECOOL_OPTIONS = ['YES, ALWAYS', 'SOMETIMES', 'NEVER'];

function TempSelector({
  number, label, value, onChange, includesSame,
}: {
  number: string; label: string; value?: number | 'same';
  onChange: (v: number | 'same') => void; includesSame?: boolean;
}) {
  return (
    <View style={{ marginBottom: 10, borderWidth: 1, borderColor: '#2d5a2d', padding: 14 }}>
      <Text style={{ fontFamily: 'monospace', fontSize: 9, color: '#f4f0e6', textTransform: 'uppercase', letterSpacing: 2, opacity: 0.5, marginBottom: 10 }}>
        {number}  {label}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {includesSame && (
            <TouchableOpacity
              onPress={() => onChange('same')}
              activeOpacity={0.7}
              style={{
                paddingHorizontal: 12, paddingVertical: 8,
                borderWidth: 1,
                borderColor: value === 'same' ? '#f4f0e6' : '#2d5a2d',
                backgroundColor: value === 'same' ? '#f4f0e6' : 'transparent',
              }}
            >
              <Text style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: 1, color: value === 'same' ? '#1a3a1a' : '#f4f0e6', fontWeight: value === 'same' ? 'bold' : 'normal' }}>
                SAME
              </Text>
            </TouchableOpacity>
          )}
          {TEMP_STEPS.map((t) => {
            const active = value === t;
            return (
              <TouchableOpacity
                key={t}
                onPress={async () => { await Haptics.selectionAsync(); onChange(t); }}
                activeOpacity={0.7}
                style={{
                  paddingHorizontal: 10, paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: active ? '#f4f0e6' : '#2d5a2d',
                  backgroundColor: active ? '#f4f0e6' : 'transparent',
                }}
              >
                <Text style={{ fontFamily: 'monospace', fontSize: 11, color: active ? '#1a3a1a' : '#f4f0e6', fontWeight: active ? 'bold' : 'normal' }}>
                  {t}°
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

export default function DashboardScreen() {
  const { make, model, hasDualZone, hasRearVents, answers, setAnswer, setResult, compatPayload } = useClimateStore();

  const required: (keyof Answers)[] = [
    'driverTemp', 'fanSpeed', 'ventDirection', 'recirc',
    'acCompressor', 'climateMode', 'rearVents', 'heatedSeats', 'preCool',
  ];
  if (hasDualZone) required.push('passengerTemp');
  const allAnswered = required.every((k) => answers[k] !== undefined);

  async function handleSubmit() {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const { archetype, x, y } = pickArchetype(answers);
    setResult(archetype.id, x, y);
    router.push('/result');
  }

  // fan display value
  const fanDisplay = answers.fanSpeed === 'auto' ? 'AUTO' : answers.fanSpeed !== undefined ? String(answers.fanSpeed) : undefined;

  return (
    <View style={{ flex: 1, backgroundColor: '#1a3a1a' }}>
      <View style={{ paddingTop: 60, paddingBottom: 14, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#2d5a2d' }}>
        <Text style={{ fontFamily: 'monospace', fontSize: 9, color: '#f4f0e6', opacity: 0.5, textTransform: 'uppercase', letterSpacing: 2 }}>
          Step 2 of 2 — Climate Configuration
        </Text>
        <Text style={{ fontFamily: 'monospace', fontSize: 16, color: '#f4f0e6', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginTop: 4 }}>
          {make} {model}
        </Text>
        <Text style={{ fontFamily: 'monospace', fontSize: 9, color: '#f4f0e6', opacity: 0.4, marginTop: 2 }}>
          Configure all 10 settings to generate your permit
        </Text>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
        <TempSelector
          number="01" label="Driver Temp"
          value={answers.driverTemp} onChange={(v) => setAnswer('driverTemp', v as number)}
        />

        {hasDualZone && (
          <TempSelector
            number="02" label="Passenger Temp"
            value={answers.passengerTemp} onChange={(v) => setAnswer('passengerTemp', v)}
            includesSame
          />
        )}

        <DashboardKnob
          number="03" label="Fan Speed"
          options={FAN_OPTIONS}
          value={fanDisplay}
          onChange={(v) => setAnswer('fanSpeed', v === 'AUTO' ? 'auto' : parseInt(v, 10) as any)}
        />

        <DashboardKnob
          number="04" label="Vent Direction"
          options={VENT_OPTIONS}
          value={answers.ventDirection?.toUpperCase()}
          onChange={(v) => setAnswer('ventDirection', v.toLowerCase() as Answers['ventDirection'])}
        />

        <DashboardKnob
          number="05" label="Recirculation"
          options={RECIRC_OPTIONS}
          value={answers.recirc?.toUpperCase()}
          onChange={(v) => setAnswer('recirc', v.toLowerCase() as Answers['recirc'])}
        />

        <DashboardKnob
          number="06" label="A/C Compressor"
          options={AC_OPTIONS}
          value={answers.acCompressor?.toUpperCase()}
          onChange={(v) => setAnswer('acCompressor', v.toLowerCase() as Answers['acCompressor'])}
        />

        <DashboardKnob
          number="07" label="Climate Mode"
          options={MODE_OPTIONS}
          value={answers.climateMode?.toUpperCase()}
          onChange={(v) => setAnswer('climateMode', v.toLowerCase() as Answers['climateMode'])}
        />

        <DashboardKnob
          number="08" label="Rear Vents"
          options={REAR_OPTIONS}
          value={answers.rearVents === 'what' ? 'WHAT REAR VENTS?' : answers.rearVents?.toUpperCase()}
          onChange={(v) => setAnswer('rearVents', (v === 'WHAT REAR VENTS?' ? 'what' : v.toLowerCase()) as Answers['rearVents'])}
        />

        <DashboardKnob
          number="09" label="Heated / Cooled Seats"
          options={SEATS_OPTIONS}
          value={answers.heatedSeats?.toUpperCase()}
          onChange={(v) => setAnswer('heatedSeats', v.toLowerCase() as Answers['heatedSeats'])}
        />

        <DashboardKnob
          number="10" label="Pre-Cool Before Drive"
          options={PRECOOL_OPTIONS}
          value={answers.preCool === 'yes' ? 'YES, ALWAYS' : answers.preCool?.toUpperCase()}
          onChange={(v) => setAnswer('preCool', (v === 'YES, ALWAYS' ? 'yes' : v.toLowerCase()) as Answers['preCool'])}
        />

        <View style={{ height: 24 }} />
      </ScrollView>

      <View style={{ paddingHorizontal: 24, paddingBottom: 40, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#2d5a2d' }}>
        <TouchableOpacity
          style={{
            paddingVertical: 18, alignItems: 'center',
            backgroundColor: allAnswered ? '#f4f0e6' : 'transparent',
            borderWidth: allAnswered ? 0 : 1,
            borderColor: '#2d5a2d',
            opacity: allAnswered ? 1 : 0.5,
          }}
          onPress={handleSubmit}
          disabled={!allAnswered}
          activeOpacity={0.85}
        >
          <Text style={{
            fontFamily: 'monospace', fontSize: 12, fontWeight: 'bold',
            textTransform: 'uppercase', letterSpacing: 3,
            color: allAnswered ? '#1a3a1a' : '#f4f0e6',
          }}>
            Submit Configuration
          </Text>
        </TouchableOpacity>
        {!allAnswered && (
          <Text style={{ fontFamily: 'monospace', fontSize: 9, color: '#f4f0e6', textAlign: 'center', marginTop: 8, opacity: 0.4 }}>
            {required.filter((k) => answers[k] === undefined).length} setting(s) remaining
          </Text>
        )}
      </View>
    </View>
  );
}
