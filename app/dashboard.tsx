import { View, Text, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, FadeIn } from 'react-native-reanimated';
import { useClimateStore, Answers } from '../lib/store';
import { pickArchetype } from '../lib/scoring';

const TEMP_STEPS = [60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80];

const C = {
  chrome: '#1a3a1a',
  chromeSoft: '#2d5a2d',
  chromeDeep: '#0e2410',
  cream: '#f4f0e6',
  panel: '#1a1814',
  panelLight: '#2c2820',
  panelEdge: '#3a342a',
  panelHighlight: '#4a4234',
  panelShadow: '#080604',
  amber: '#ffb84d',
  amberDim: '#3a2810',
  amberBright: '#ffd17a',
  silk: '#d8cfb8',
  silkDim: '#7d735c',
  red: '#8b2020',
};

function PowerDot({ on }: { on: boolean }) {
  const s = useSharedValue(0.6);
  useEffect(() => {
    if (on) {
      s.value = withRepeat(withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.sin) }), -1, true);
    } else {
      s.value = 0.4;
    }
  }, [on]);
  const animStyle = useAnimatedStyle(() => ({ opacity: s.value }));
  return (
    <Animated.View
      style={[
        {
          width: 7, height: 7, borderRadius: 4,
          backgroundColor: on ? C.amberBright : C.amberDim,
          shadowColor: C.amber, shadowOpacity: on ? 0.9 : 0, shadowRadius: 6, shadowOffset: { width: 0, height: 0 },
        },
        animStyle,
      ]}
    />
  );
}

function LCDReadout({ value, label, big }: { value?: number | 'same'; label: string; big?: boolean }) {
  let display: string;
  let degree = false;
  if (value === undefined) display = '—';
  else if (value === 'same') display = 'SAME';
  else { display = String(value); degree = true; }
  return (
    <View
      style={{
        borderWidth: 2,
        borderTopColor: C.panelShadow, borderLeftColor: C.panelShadow,
        borderBottomColor: C.panelHighlight, borderRightColor: C.panelHighlight,
        backgroundColor: C.amberDim,
        paddingVertical: big ? 14 : 10, paddingHorizontal: 14,
      }}
    >
      <Text
        style={{
          fontFamily: 'monospace', fontSize: 8, color: C.amber, opacity: 0.7,
          letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 4,
        }}
      >
        {label}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' }}>
        <Text
          style={{
            fontFamily: 'monospace',
            fontSize: big ? 42 : 32,
            fontWeight: 'bold',
            color: C.amberBright,
            letterSpacing: big ? 3 : 2,
            lineHeight: big ? 46 : 36,
            textShadowColor: C.amber,
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 12,
          }}
        >
          {display}
        </Text>
        {degree && (
          <Text
            style={{
              fontFamily: 'monospace',
              fontSize: big ? 14 : 12,
              color: C.amber,
              opacity: 0.85,
              marginLeft: 3, marginBottom: big ? 6 : 4,
              textShadowColor: C.amber, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8,
            }}
          >
            °F
          </Text>
        )}
      </View>
    </View>
  );
}

function TempStepper({
  value, onChange, includesSame,
}: {
  value?: number | 'same';
  onChange: (v: number | 'same') => void;
  includesSame?: boolean;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 2 }}>
      <View style={{ flexDirection: 'row', gap: 5 }}>
        {includesSame && (
          <Pressable
            onPress={async () => { await Haptics.selectionAsync(); onChange('same'); }}
            style={{
              paddingHorizontal: 12, paddingVertical: 7,
              borderWidth: 1.5,
              borderTopColor: value === 'same' ? C.amberBright : C.panelHighlight,
              borderLeftColor: value === 'same' ? C.amberBright : C.panelHighlight,
              borderBottomColor: value === 'same' ? C.amber : C.panelShadow,
              borderRightColor: value === 'same' ? C.amber : C.panelShadow,
              backgroundColor: value === 'same' ? C.amberDim : C.panel,
            }}
          >
            <Text style={{ fontFamily: 'monospace', fontSize: 10, color: value === 'same' ? C.amberBright : C.silk, letterSpacing: 1.5, fontWeight: value === 'same' ? 'bold' : 'normal' }}>
              SAME
            </Text>
          </Pressable>
        )}
        {TEMP_STEPS.map((t) => {
          const active = value === t;
          return (
            <Pressable
              key={t}
              onPress={async () => { await Haptics.selectionAsync(); onChange(t); }}
              style={{
                paddingHorizontal: 10, paddingVertical: 7,
                borderWidth: 1.5,
                borderTopColor: active ? C.amberBright : C.panelHighlight,
                borderLeftColor: active ? C.amberBright : C.panelHighlight,
                borderBottomColor: active ? C.amber : C.panelShadow,
                borderRightColor: active ? C.amber : C.panelShadow,
                backgroundColor: active ? C.amberDim : C.panel,
                minWidth: 38, alignItems: 'center',
              }}
            >
              <Text style={{
                fontFamily: 'monospace', fontSize: 11,
                color: active ? C.amberBright : C.silk,
                fontWeight: active ? 'bold' : 'normal',
              }}>
                {t}°
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

function SectionLabel({ children, icon }: { children: React.ReactNode; icon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'] }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14, marginBottom: 8 }}>
      <View style={{ flex: 0, height: 1, width: 12, backgroundColor: C.panelEdge }} />
      {icon && <MaterialCommunityIcons name={icon} size={10} color={C.silkDim} />}
      <Text style={{
        fontFamily: 'monospace', fontSize: 8, color: C.silkDim,
        letterSpacing: 3, textTransform: 'uppercase',
      }}>
        {children}
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: C.panelEdge }} />
    </View>
  );
}

function PanelButton({
  active, onPress, icon, label, sub, flex = 1, wide,
}: {
  active: boolean;
  onPress: () => void;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  sub?: string;
  flex?: number;
  wide?: boolean;
}) {
  return (
    <Pressable
      onPress={async () => { await Haptics.selectionAsync(); onPress(); }}
      style={({ pressed }) => ({
        flex,
        paddingVertical: 12,
        paddingHorizontal: wide ? 6 : 10,
        borderWidth: 1.5,
        borderTopColor: active ? C.amberBright : C.panelHighlight,
        borderLeftColor: active ? C.amberBright : C.panelHighlight,
        borderBottomColor: active ? C.amber : C.panelShadow,
        borderRightColor: active ? C.amber : C.panelShadow,
        backgroundColor: active ? C.amberDim : C.panel,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.7 : 1,
        minHeight: 56,
      })}
    >
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color={active ? C.amberBright : C.silk}
          style={{
            textShadowColor: active ? C.amber : 'transparent',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 8,
          }}
        />
      )}
      <Text style={{
        fontFamily: 'monospace',
        fontSize: 9,
        marginTop: icon ? 4 : 0,
        color: active ? C.amberBright : C.silk,
        letterSpacing: 1.5, textTransform: 'uppercase',
        fontWeight: active ? 'bold' : 'normal',
        textAlign: 'center',
      }}>
        {label}
      </Text>
      {sub && (
        <Text style={{ fontFamily: 'monospace', fontSize: 7, color: active ? C.amber : C.silkDim, marginTop: 2, letterSpacing: 1 }}>
          {sub}
        </Text>
      )}
    </Pressable>
  );
}

function VentArrows({ direction }: { direction: 'face' | 'feet' | 'defrost' | 'mix' }) {
  const arrow = {
    face: '↑↑',
    feet: '↓',
    defrost: '⌃',
    mix: '↕',
  }[direction];
  return (
    <Text style={{ fontFamily: 'monospace', fontSize: 18, lineHeight: 22, color: 'inherit' as any }}>
      {arrow}
    </Text>
  );
}

export default function DashboardScreen() {
  const { make, model, hasDualZone, hasRearVents, answers, setAnswer, setResult } = useClimateStore();

  const required: (keyof Answers)[] = [
    'driverTemp', 'fanSpeed', 'ventDirection', 'recirc',
    'acCompressor', 'climateMode', 'rearVents', 'heatedSeats', 'preCool',
  ];
  if (hasDualZone) required.push('passengerTemp');
  const allAnswered = required.every((k) => answers[k] !== undefined);
  const remainingCount = required.filter((k) => answers[k] === undefined).length;

  async function handleSubmit() {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const { archetype, x, y } = pickArchetype(answers);
    setResult(archetype.id, x, y);
    router.push('/result');
  }

  function set<K extends keyof Answers>(k: K, v: Answers[K]) {
    setAnswer(k, v);
  }

  const autoOn = answers.climateMode === 'auto';

  return (
    <View style={{ flex: 1, backgroundColor: C.chrome }}>
      {/* DoCC header */}
      <View style={{ paddingTop: 60, paddingBottom: 14, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: C.chromeSoft }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }} activeOpacity={0.6}>
          <Text style={{ fontFamily: 'monospace', fontSize: 10, color: C.cream, textTransform: 'uppercase', letterSpacing: 2, opacity: 0.55 }}>
            ‹ Change Vehicle
          </Text>
        </TouchableOpacity>
        <Text style={{ fontFamily: 'monospace', fontSize: 9, color: C.cream, opacity: 0.5, textTransform: 'uppercase', letterSpacing: 2 }}>
          Step 2 of 2 — Operator Evaluation
        </Text>
        <Text style={{ fontFamily: 'monospace', fontSize: 16, color: C.cream, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginTop: 4 }}>
          {make} {model}
        </Text>
        <Text style={{ fontFamily: 'monospace', fontSize: 9, color: C.cream, opacity: 0.45, marginTop: 3 }}>
          Operate the climate panel exactly as you would in real life.
        </Text>
      </View>

      {/* The HVAC Panel */}
      <ScrollView style={{ flex: 1, backgroundColor: C.chromeDeep }} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
        <Animated.View
          entering={FadeIn.duration(450)}
          style={{
            backgroundColor: C.panel,
            borderWidth: 2,
            borderTopColor: C.panelHighlight,
            borderLeftColor: C.panelHighlight,
            borderBottomColor: C.panelShadow,
            borderRightColor: C.panelShadow,
            padding: 14,
          }}
        >
          {/* Panel header — silkscreen */}
          <View style={{
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
            paddingBottom: 8, marginBottom: 12,
            borderBottomWidth: 1, borderBottomColor: C.panelEdge,
          }}>
            <Text style={{ fontFamily: 'monospace', fontSize: 8, color: C.silk, letterSpacing: 3, textTransform: 'uppercase' }}>
              Climate · Control
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <PowerDot on={autoOn} />
              <Text style={{ fontFamily: 'monospace', fontSize: 7, color: autoOn ? C.amber : C.silkDim, letterSpacing: 2 }}>
                AUTO
              </Text>
            </View>
          </View>

          {/* TEMPS — LCD displays */}
          <SectionLabel icon="thermometer">Temperature</SectionLabel>
          <View style={{ flexDirection: hasDualZone ? 'row' : 'column', gap: 8 }}>
            <View style={{ flex: 1 }}>
              <LCDReadout value={answers.driverTemp} label="Driver" big={!hasDualZone} />
              <TempStepper value={answers.driverTemp} onChange={(v) => set('driverTemp', v as number)} />
            </View>
            {hasDualZone && (
              <View style={{ flex: 1 }}>
                <LCDReadout value={answers.passengerTemp} label="Passenger" />
                <TempStepper value={answers.passengerTemp} onChange={(v) => set('passengerTemp', v)} includesSame />
              </View>
            )}
          </View>

          {/* FAN SPEED */}
          <SectionLabel icon="fan">Fan Speed</SectionLabel>
          <View style={{ flexDirection: 'row', gap: 4, flexWrap: 'wrap' }}>
            {['1', '2', '3', '4', '5', '6', '7'].map((n) => {
              const active = String(answers.fanSpeed) === n;
              return (
                <PanelButton
                  key={n}
                  active={active}
                  onPress={() => set('fanSpeed', parseInt(n, 10) as any)}
                  label={n}
                  flex={0}
                />
              );
            })}
            <View style={{ flex: 1 }}>
              <PanelButton
                active={answers.fanSpeed === 'auto'}
                onPress={() => set('fanSpeed', 'auto')}
                label="Auto"
                icon="fan-auto"
              />
            </View>
          </View>

          {/* VENT DIRECTION */}
          <SectionLabel icon="weather-windy">Vent Direction</SectionLabel>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <PanelButton
              active={answers.ventDirection === 'face'}
              onPress={() => set('ventDirection', 'face')}
              label="Face"
              sub="↑↑"
            />
            <PanelButton
              active={answers.ventDirection === 'feet'}
              onPress={() => set('ventDirection', 'feet')}
              label="Feet"
              sub="↓"
            />
            <PanelButton
              active={answers.ventDirection === 'defrost'}
              onPress={() => set('ventDirection', 'defrost')}
              label="Defrost"
              icon="car-defrost-front"
            />
            <PanelButton
              active={answers.ventDirection === 'mix'}
              onPress={() => set('ventDirection', 'mix')}
              label="Mix"
              sub="↕"
            />
          </View>

          {/* AIR — A/C + Recirc */}
          <SectionLabel icon="air-conditioner">Air Compressor</SectionLabel>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <PanelButton
              active={answers.acCompressor === 'on'}
              onPress={() => set('acCompressor', 'on')}
              label="A/C On"
              icon="snowflake"
            />
            <PanelButton
              active={answers.acCompressor === 'off'}
              onPress={() => set('acCompressor', 'off')}
              label="A/C Off"
              icon="snowflake-off"
            />
            <PanelButton
              active={answers.acCompressor === 'auto'}
              onPress={() => set('acCompressor', 'auto')}
              label="A/C Auto"
              icon="cog"
            />
          </View>

          <SectionLabel icon="recycle-variant">Recirculation</SectionLabel>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <PanelButton
              active={answers.recirc === 'on'}
              onPress={() => set('recirc', 'on')}
              label="Recirc"
              icon="autorenew"
            />
            <PanelButton
              active={answers.recirc === 'off'}
              onPress={() => set('recirc', 'off')}
              label="Fresh"
              icon="weather-windy"
            />
            <PanelButton
              active={answers.recirc === 'auto'}
              onPress={() => set('recirc', 'auto')}
              label="Auto"
              icon="cog"
            />
          </View>

          {/* CLIMATE MODE */}
          <SectionLabel>Climate Mode</SectionLabel>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <PanelButton
              active={answers.climateMode === 'auto'}
              onPress={() => set('climateMode', 'auto')}
              label="Auto"
              sub="Trust the system"
            />
            <PanelButton
              active={answers.climateMode === 'manual'}
              onPress={() => set('climateMode', 'manual')}
              label="Manual"
              sub="I know better"
            />
          </View>

          {/* REAR VENTS */}
          <SectionLabel icon="car-back">Rear Vents</SectionLabel>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <PanelButton
              active={answers.rearVents === 'open'}
              onPress={() => set('rearVents', 'open')}
              label="Open"
            />
            <PanelButton
              active={answers.rearVents === 'closed'}
              onPress={() => set('rearVents', 'closed')}
              label="Closed"
            />
            <PanelButton
              active={answers.rearVents === 'what'}
              onPress={() => set('rearVents', 'what')}
              label="What"
              sub="rear vents?"
              flex={1.3}
            />
          </View>

          {/* HEATED SEATS */}
          <SectionLabel icon="car-seat-heater">Heated / Cooled Seats</SectionLabel>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <PanelButton
              active={answers.heatedSeats === 'always'}
              onPress={() => set('heatedSeats', 'always')}
              label="Always"
            />
            <PanelButton
              active={answers.heatedSeats === 'sometimes'}
              onPress={() => set('heatedSeats', 'sometimes')}
              label="Sometimes"
            />
            <PanelButton
              active={answers.heatedSeats === 'never'}
              onPress={() => set('heatedSeats', 'never')}
              label="Never"
            />
          </View>

          {/* PRE-COOL */}
          <SectionLabel icon="clock-time-eight-outline">Pre-Cool Before Drive</SectionLabel>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <PanelButton
              active={answers.preCool === 'yes'}
              onPress={() => set('preCool', 'yes')}
              label="Always"
              sub="forecast checked"
            />
            <PanelButton
              active={answers.preCool === 'sometimes'}
              onPress={() => set('preCool', 'sometimes')}
              label="Sometimes"
            />
            <PanelButton
              active={answers.preCool === 'never'}
              onPress={() => set('preCool', 'never')}
              label="Never"
            />
          </View>

          {/* Panel serial footer */}
          <View style={{ marginTop: 18, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.panelEdge, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: 'monospace', fontSize: 7, color: C.silkDim, letterSpacing: 2 }}>
              CCU-PNL · REV 04
            </Text>
            <Text style={{ fontFamily: 'monospace', fontSize: 7, color: C.silkDim, letterSpacing: 2 }}>
              OEM · NON-USER-SERVICEABLE
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Submit footer */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 40, paddingTop: 14, borderTopWidth: 1, borderTopColor: C.chromeSoft, backgroundColor: C.chrome }}>
        <TouchableOpacity
          style={{
            paddingVertical: 18, alignItems: 'center',
            backgroundColor: allAnswered ? C.cream : 'transparent',
            borderWidth: allAnswered ? 0 : 1,
            borderColor: C.chromeSoft,
            opacity: allAnswered ? 1 : 0.55,
          }}
          onPress={handleSubmit}
          disabled={!allAnswered}
          activeOpacity={0.85}
        >
          <Text style={{
            fontFamily: 'monospace', fontSize: 12, fontWeight: 'bold',
            textTransform: 'uppercase', letterSpacing: 3,
            color: allAnswered ? C.chrome : C.cream,
          }}>
            {allAnswered ? 'Submit Configuration' : `${remainingCount} setting${remainingCount === 1 ? '' : 's'} remaining`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
