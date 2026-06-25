import { View, Text, ScrollView, TouchableOpacity, Pressable, PanResponder } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, Fragment, useRef } from 'react';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, FadeIn } from 'react-native-reanimated';
import { useClimateStore, Answers } from '../lib/store';
import { pickArchetype } from '../lib/scoring';
import { getDashboardImage } from '../lib/dashboardImages';
import { useTheme, Palette } from '../constants/palette';
import { MetalButton } from '../components/ui/gold';

const TEMP_STEPS = [60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80];

// The dashboard speaks in the "machine panel" voice — monospace + amber/silk
// HVAC vocabulary. Hex values are sourced from the active palette so there's
// one source of truth; only the semantic aliases live here. Each component
// pulls the themed set via useDashC().
function dashColors(P: Palette) {
  return {
    chrome: P.bg,                // app bg
    chromeSoft: 'rgba(201, 168, 117, 0.18)',  // divider
    chromeDeep: P.bg,            // scrollview bg
    cream: P.gold,               // active button gold
    panel: P.bg2,                // panel surface
    panelLight: '#2a2e36',       // bevel highlight (top/left)
    panelEdge: 'rgba(201, 168, 117, 0.22)', // section dividers
    panelHighlight: P.tileHi,    // tile bevel top
    panelShadow: P.cardDark,     // bevel shadow (bottom/right)
    amber: P.gold,               // gold
    amberDim: P.goldDim,         // gold dim
    amberBright: P.goldBright,   // gold bright
    silk: P.text,                // primary text
    silkDim: P.textDim,          // secondary text
    red: P.red,
  };
}
function useDashC() {
  return dashColors(useTheme());
}

function BrandBanner({
  make, model, answers, onCycleTemp,
}: {
  make: string;
  model: string;
  answers: Answers;
  onCycleTemp: (direction: 'up' | 'down') => void;
}) {
  const C = useDashC();
  const temp = answers.driverTemp;
  const fan = answers.fanSpeed;
  const acOn = answers.acCompressor === 'on';
  const autoOn = answers.climateMode === 'auto';
  const recircOn = answers.recirc === 'on';

  return (
    <View style={{
      width: '100%', aspectRatio: 1536 / 1024, marginBottom: 12,
      padding: 6,
      backgroundColor: C.panel,
      borderTopColor: C.panelHighlight, borderLeftColor: C.panelHighlight,
      borderBottomColor: C.panelShadow, borderRightColor: C.panelShadow,
      borderWidth: 1.5,
      shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
    }}>
      <Pressable
        onPress={async () => { await Haptics.selectionAsync(); onCycleTemp('up'); }}
        onLongPress={async () => { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onCycleTemp('down'); }}
        style={{ flex: 1, borderWidth: 1, borderColor: C.amber }}
      >
        <Image
          source={getDashboardImage(make)}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
        />

        {/* Brand marker — top left */}
        <View style={{
          position: 'absolute', top: 8, left: 8,
          backgroundColor: 'rgba(20, 20, 16, 0.85)',
          borderWidth: 1, borderColor: C.amber,
          paddingHorizontal: 8, paddingVertical: 3,
        }}>
          <Text style={{ fontFamily: 'monospace', fontSize: 8, color: C.amber, letterSpacing: 2, textTransform: 'uppercase' }}>
            {make} · {model}
          </Text>
        </View>

        {/* HUD — top right */}
        <View style={{
          position: 'absolute', top: 8, right: 8,
          backgroundColor: 'rgba(20, 20, 16, 0.88)',
          borderWidth: 1.5, borderColor: C.amber,
          paddingVertical: 8, paddingHorizontal: 10, minWidth: 90,
        }}>
          <Text style={{ fontFamily: 'monospace', fontSize: 7, color: C.amber, opacity: 0.65, letterSpacing: 2, textTransform: 'uppercase' }}>
            Driver Temp
          </Text>
          <Text style={{
            fontFamily: 'monospace', fontSize: 28, fontWeight: 'bold',
            color: C.amberBright,
            letterSpacing: 1, lineHeight: 30,
            textShadowColor: C.amber, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10,
          }}>
            {temp !== undefined ? `${temp}°` : '--°'}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
            <View style={{
              width: 6, height: 6, borderRadius: 3,
              backgroundColor: acOn ? C.amberBright : C.amberDim,
              shadowColor: C.amber, shadowOpacity: acOn ? 0.9 : 0, shadowRadius: 4,
            }} />
            <Text style={{ fontFamily: 'monospace', fontSize: 7, color: acOn ? C.amber : C.silkDim, letterSpacing: 1.5 }}>
              A/C
            </Text>
            <View style={{
              width: 6, height: 6, borderRadius: 3,
              backgroundColor: autoOn ? C.amberBright : C.amberDim,
              shadowColor: C.amber, shadowOpacity: autoOn ? 0.9 : 0, shadowRadius: 4,
              marginLeft: 4,
            }} />
            <Text style={{ fontFamily: 'monospace', fontSize: 7, color: autoOn ? C.amber : C.silkDim, letterSpacing: 1.5 }}>
              AUTO
            </Text>
            <View style={{
              width: 6, height: 6, borderRadius: 3,
              backgroundColor: recircOn ? C.amberBright : C.amberDim,
              shadowColor: C.amber, shadowOpacity: recircOn ? 0.9 : 0, shadowRadius: 4,
              marginLeft: 4,
            }} />
            <Text style={{ fontFamily: 'monospace', fontSize: 7, color: recircOn ? C.amber : C.silkDim, letterSpacing: 1.5 }}>
              RCRC
            </Text>
          </View>

          <View style={{ marginTop: 6, flexDirection: 'row', gap: 2 }}>
            <Text style={{ fontFamily: 'monospace', fontSize: 7, color: C.amber, opacity: 0.65, letterSpacing: 1.5, marginRight: 4 }}>
              FAN
            </Text>
            {[1, 2, 3, 4, 5, 6, 7].map((n) => {
              const lit = typeof fan === 'number' ? n <= fan : fan === 'auto' ? true : false;
              return (
                <View
                  key={n}
                  style={{
                    width: 6, height: 8,
                    backgroundColor: lit ? C.amberBright : C.amberDim,
                    shadowColor: C.amber, shadowOpacity: lit ? 0.7 : 0, shadowRadius: 3,
                  }}
                />
              );
            })}
          </View>
        </View>

        {/* Tap hint — bottom */}
        <View style={{
          position: 'absolute', bottom: 6, alignSelf: 'center',
          backgroundColor: 'rgba(20, 20, 16, 0.75)',
          paddingHorizontal: 10, paddingVertical: 3,
        }}>
          <Text style={{ fontFamily: 'monospace', fontSize: 8, color: C.amber, letterSpacing: 2, textTransform: 'uppercase' }}>
            Tap · +1   Hold · −1
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

function PowerDot({ on }: { on: boolean }) {
  const C = useDashC();
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
  const C = useDashC();
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
        backgroundColor: '#5c2a2a',
        paddingVertical: big ? 14 : 10, paddingHorizontal: 14,
      }}
    >
      <Text
        style={{
          fontFamily: 'monospace', fontSize: 8, color: C.amber, opacity: 0.85,
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

const KNOB_SIZE = 124;
const KNOB_RADIUS = KNOB_SIZE / 2;
const DASH_R = KNOB_RADIUS - 12;
const LABEL_R = KNOB_RADIUS + 13;

const KNOB_DISC = '#0e1825';
const KNOB_RIM = '#050810';
const KNOB_INNER = '#152234';
const POINTER_WHITE = '#f5f0e0';
const DASH_COOL = '#5489c4';
const DASH_COOL_BRIGHT = '#7eb0e6';
const DASH_NEUTRAL = '#bcb6a4';
const DASH_NEUTRAL_BRIGHT = '#e8e2d2';
const DASH_WARM = '#c2604f';
const DASH_WARM_BRIGHT = '#e88573';

function dashColor(i: number, active: boolean) {
  if (i <= 3) return active ? DASH_COOL_BRIGHT : DASH_COOL;
  if (i <= 6) return active ? DASH_NEUTRAL_BRIGHT : DASH_NEUTRAL;
  return active ? DASH_WARM_BRIGHT : DASH_WARM;
}

function TempStepper({
  value, onChange, includesSame,
}: {
  value?: number | 'same';
  onChange: (v: number | 'same') => void;
  includesSame?: boolean;
}) {
  return (
    <View style={{ alignItems: 'center', marginTop: 8, paddingTop: 4, paddingBottom: includesSame ? 0 : 8 }}>
      <TempKnob value={typeof value === 'number' ? value : undefined} onChange={onChange} />
      {includesSame && (
        <SamePill
          active={value === 'same'}
          onPress={() => onChange(value === 'same' ? 70 : 'same')}
        />
      )}
    </View>
  );
}

function angleForIndex(i: number) {
  return -90 + i * 18;
}

function TempKnob({
  value, onChange,
}: {
  value?: number;
  onChange: (v: number) => void;
}) {
  const lastValueRef = useRef<number | undefined>(value);
  lastValueRef.current = value;

  const handleTouch = (locationX: number, locationY: number) => {
    const dx = locationX - KNOB_RADIUS;
    const dy = locationY - KNOB_RADIUS;
    let angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
    if (angle < -90) angle = -90;
    if (angle > 90) angle = 90;
    const idx = Math.round((angle + 90) / 18);
    const newValue = TEMP_STEPS[Math.max(0, Math.min(TEMP_STEPS.length - 1, idx))];
    if (newValue !== lastValueRef.current) {
      Haptics.selectionAsync();
      lastValueRef.current = newValue;
      onChange(newValue);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => handleTouch(e.nativeEvent.locationX, e.nativeEvent.locationY),
      onPanResponderMove: (e) => handleTouch(e.nativeEvent.locationX, e.nativeEvent.locationY),
    })
  ).current;

  const pointerAngle = value !== undefined ? angleForIndex(TEMP_STEPS.indexOf(value)) : null;

  return (
    <View
      style={{
        width: KNOB_SIZE + 40,
        height: KNOB_SIZE + 26,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {TEMP_STEPS.map((t, i) => {
        if (i % 2 !== 0) return null;
        const angle = angleForIndex(i);
        const active = value === t;
        return (
          <View
            key={`l${t}`}
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: (KNOB_SIZE + 26) / 2 - 8,
              left: (KNOB_SIZE + 40) / 2 - 11,
              width: 22,
              height: 16,
              transform: [
                { rotate: `${angle}deg` },
                { translateY: -LABEL_R },
                { rotate: `${-angle}deg` },
              ],
            }}
          >
            <Text
              style={{
                fontFamily: 'monospace',
                fontSize: active ? 11 : 10,
                fontWeight: active ? 'bold' : 'normal',
                color: POINTER_WHITE,
                opacity: active ? 1 : 0.75,
                textAlign: 'center',
              }}
            >
              {t}
            </Text>
          </View>
        );
      })}

      <View
        style={{
          width: KNOB_SIZE,
          height: KNOB_SIZE,
          borderRadius: KNOB_RADIUS,
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        {...panResponder.panHandlers}
      >
        <View
          style={{
            position: 'absolute',
            width: KNOB_SIZE, height: KNOB_SIZE,
            borderRadius: KNOB_RADIUS,
            backgroundColor: KNOB_DISC,
            borderWidth: 1.5,
            borderColor: KNOB_RIM,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.6,
            shadowRadius: 8,
            elevation: 8,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 4, left: 4,
            width: KNOB_SIZE - 8, height: KNOB_SIZE - 8,
            borderRadius: (KNOB_SIZE - 8) / 2,
            borderWidth: 1,
            borderColor: KNOB_INNER,
            backgroundColor: 'transparent',
          }}
        />

        {TEMP_STEPS.map((t, i) => {
          const angle = angleForIndex(i);
          const active = value === t;
          const color = dashColor(i, active);
          return (
            <View
              key={`d${t}`}
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: KNOB_RADIUS, left: KNOB_RADIUS,
                width: 0, height: 0,
                transform: [
                  { rotate: `${angle}deg` },
                  { translateY: -DASH_R },
                ],
              }}
            >
              <View
                style={{
                  width: active ? 5 : 4,
                  height: active ? 16 : 13,
                  backgroundColor: color,
                  borderRadius: 1,
                  marginLeft: active ? -2.5 : -2,
                  marginTop: -((active ? 16 : 13) / 2),
                }}
              />
            </View>
          );
        })}

        {pointerAngle !== null && (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: KNOB_RADIUS, left: KNOB_RADIUS,
              width: 0, height: 0,
              transform: [{ rotate: `${pointerAngle}deg` }],
            }}
          >
            <View
              style={{
                width: 18,
                height: KNOB_RADIUS - 8,
                backgroundColor: '#1c2a3f',
                borderTopLeftRadius: 9,
                borderTopRightRadius: 9,
                borderBottomLeftRadius: 4,
                borderBottomRightRadius: 4,
                borderWidth: 1,
                borderColor: '#26344d',
                marginLeft: -9,
                marginTop: -(KNOB_RADIUS - 8) + 6,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 3,
                elevation: 4,
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: -(KNOB_RADIUS - 24),
                left: 0,
                width: 0, height: 0,
                borderLeftWidth: 9,
                borderRightWidth: 9,
                borderBottomWidth: 14,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: POINTER_WHITE,
                marginLeft: -9,
              }}
            />
          </View>
        )}

        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: KNOB_RADIUS - 5, left: KNOB_RADIUS - 5,
            width: 10, height: 10, borderRadius: 5,
            backgroundColor: KNOB_RIM,
            borderWidth: 1,
            borderColor: KNOB_INNER,
          }}
        />
      </View>
    </View>
  );
}

function SamePill({
  active, onPress,
}: {
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={async () => { await Haptics.selectionAsync(); onPress(); }}
      style={{
        marginTop: 10,
        paddingHorizontal: 16,
        paddingVertical: 7,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: POINTER_WHITE,
        backgroundColor: active ? POINTER_WHITE : KNOB_DISC,
      }}
    >
      <Text
        style={{
          fontFamily: 'monospace',
          fontSize: 10,
          fontWeight: 'bold',
          color: active ? KNOB_DISC : POINTER_WHITE,
          letterSpacing: 1.8,
        }}
      >
        SAME AS DRIVER
      </Text>
    </Pressable>
  );
}

function SectionLabel({ children, icon }: { children: React.ReactNode; icon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'] }) {
  const C = useDashC();
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
  const C = useDashC();
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
  const C = useDashC();
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

  function cycleTemp(direction: 'up' | 'down') {
    const current = answers.driverTemp;
    if (current === undefined) {
      setAnswer('driverTemp', direction === 'up' ? TEMP_STEPS[0] : TEMP_STEPS[TEMP_STEPS.length - 1]);
      return;
    }
    const idx = TEMP_STEPS.indexOf(current);
    if (idx === -1) {
      setAnswer('driverTemp', 70);
      return;
    }
    const newIdx = direction === 'up'
      ? (idx + 1) % TEMP_STEPS.length
      : (idx - 1 + TEMP_STEPS.length) % TEMP_STEPS.length;
    setAnswer('driverTemp', TEMP_STEPS[newIdx]);
  }

  const autoOn = answers.climateMode === 'auto';

  return (
    <View style={{ flex: 1, backgroundColor: C.chrome }}>
      {/* DoCC header */}
      <View style={{ paddingTop: 60, paddingBottom: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: C.chromeSoft }}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={{
            alignSelf: 'flex-start',
            flexDirection: 'row', alignItems: 'center', gap: 6,
            paddingHorizontal: 14, paddingVertical: 10,
            marginBottom: 14,
            backgroundColor: C.panel,
            borderTopColor: C.panelHighlight, borderLeftColor: C.panelHighlight,
            borderBottomColor: C.panelShadow, borderRightColor: C.panelShadow,
            borderWidth: 1.5,
            shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
          }}
        >
          <MaterialCommunityIcons name="chevron-left" size={18} color={C.amberBright} />
          <Text style={{
            fontFamily: 'monospace', fontSize: 12, color: C.amberBright,
            textTransform: 'uppercase', letterSpacing: 2.5, fontWeight: '600',
          }}>
            Change Vehicle
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
        <BrandBanner make={make} model={model} answers={answers} onCycleTemp={cycleTemp} />
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
        {allAnswered ? (
          <MetalButton onPress={handleSubmit}>
            <Text style={{
              fontFamily: 'monospace', fontSize: 12, fontWeight: 'bold',
              textTransform: 'uppercase', letterSpacing: 3, color: C.chrome,
            }}>
              Submit Configuration
            </Text>
          </MetalButton>
        ) : (
          <View style={{
            paddingVertical: 18, alignItems: 'center',
            borderWidth: 1, borderColor: C.chromeSoft, opacity: 0.55,
          }}>
            <Text style={{
              fontFamily: 'monospace', fontSize: 12, fontWeight: 'bold',
              textTransform: 'uppercase', letterSpacing: 3, color: C.silk,
            }}>
              {remainingCount} setting{remainingCount === 1 ? '' : 's'} remaining
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
