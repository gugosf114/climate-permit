import { View, Text, ScrollView, TouchableOpacity, Pressable, PanResponder } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, Fragment, useRef } from 'react';
const VENT_FACE_PNG = require('../assets/images/hvac-icons/face.png');
const VENT_MIX_PNG = require('../assets/images/hvac-icons/mix.png');
const VENT_FEET_PNG = require('../assets/images/hvac-icons/feet.png');
const VENT_DEFROST_PNG = require('../assets/images/hvac-icons/defrost.png');
const RECIRC_PNG = require('../assets/images/hvac-icons/recirc.png');
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSpring, Easing, FadeIn } from 'react-native-reanimated';
import { useClimateStore, Answers } from '../lib/store';
import { pickArchetype } from '../lib/scoring';
import { getDashboardImage } from '../lib/dashboardImages';

const TEMP_STEPS = [60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80];

const C = {
  chrome: '#0a0e14',           // app bg (was DoCC green)
  chromeSoft: 'rgba(201, 168, 117, 0.18)',  // divider
  chromeDeep: '#0a0e14',       // scrollview bg
  cream: '#c9a875',            // active button gold (was cream paper)
  panel: '#14191f',            // panel surface
  panelLight: '#2a2e36',       // bevel highlight (top/left)
  panelEdge: 'rgba(201, 168, 117, 0.22)', // section dividers
  panelHighlight: '#262e38',   // tile bevel top
  panelShadow: '#06080c',      // bevel shadow (bottom/right)
  amber: '#c9a875',            // gold (was amber)
  amberDim: '#5a4730',         // gold dim
  amberBright: '#e8c98a',      // gold bright
  silk: '#f0e9d8',             // primary text
  silkDim: '#a8a193',          // secondary text
  red: '#c75444',
};

function BrandBanner({
  make, model, answers, onCycleTemp,
}: {
  make: string;
  model: string;
  answers: Answers;
  onCycleTemp: (direction: 'up' | 'down') => void;
}) {
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

const KNOB_SIZE = 122;
const KNOB_RADIUS = KNOB_SIZE / 2;
const DASH_R = KNOB_RADIUS - 12;
const LABEL_R = KNOB_RADIUS + 11;
const KNOB_CONTAINER_W = KNOB_SIZE + 38;
const KNOB_CONTAINER_H = KNOB_SIZE + 26;

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

type KnobOption = {
  key: string;
  label?: string;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  render?: (props: { color: string; opacity: number; size: number }) => React.ReactNode;
};

const VENT_ICON_SIZE = 32;

function VentIcon({ source, color, opacity = 1 }: { source: any; color: string; opacity?: number }) {
  return (
    <Image
      source={source}
      style={{ width: VENT_ICON_SIZE, height: VENT_ICON_SIZE, opacity }}
      contentFit="contain"
      tintColor={color}
    />
  );
}

function FaceVentIcon({ color, opacity = 1 }: { color: string; opacity?: number }) {
  return <VentIcon source={VENT_FACE_PNG} color={color} opacity={opacity} />;
}

function FeetVentIcon({ color, opacity = 1 }: { color: string; opacity?: number }) {
  return <VentIcon source={VENT_FEET_PNG} color={color} opacity={opacity} />;
}

function MixVentIcon({ color, opacity = 1 }: { color: string; opacity?: number }) {
  return <VentIcon source={VENT_MIX_PNG} color={color} opacity={opacity} />;
}

function DefrostVentIcon({ color, opacity = 1 }: { color: string; opacity?: number }) {
  return <VentIcon source={VENT_DEFROST_PNG} color={color} opacity={opacity} />;
}

function Knob({
  options, activeKey, onChange,
  size = KNOB_SIZE,
  labelWidth = 16,
  dashColorFn,
}: {
  options: KnobOption[];
  activeKey?: string;
  onChange: (key: string) => void;
  size?: number;
  labelWidth?: number;
  dashColorFn?: (i: number, active: boolean) => string;
}) {
  const radius = size / 2;
  const dashR = radius - 12;
  const labelR = radius + 11;
  const containerW = size + 16 + labelWidth;
  const containerH = size + 26;
  const angleStep = options.length > 1 ? 180 / (options.length - 1) : 0;
  const angleForIdx = (i: number) => -90 + i * angleStep;

  const activeIdx = activeKey != null ? options.findIndex((o) => o.key === activeKey) : -1;
  const isDefault = activeIdx < 0;
  const pointerIdx = isDefault ? Math.floor(options.length / 2) : activeIdx;
  const pointerAngle = angleForIdx(pointerIdx);

  // Spring the needle to the selected detent for a real-dial feel
  // (input logic is unchanged — only the visual pointer is animated).
  const pointerRot = useSharedValue(pointerAngle);
  useEffect(() => {
    pointerRot.value = withSpring(pointerAngle, { damping: 13, stiffness: 170, mass: 0.6 });
  }, [pointerAngle]);
  const pointerAnimStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${pointerRot.value}deg` }] }));

  const lastIdxRef = useRef<number>(activeIdx);
  lastIdxRef.current = activeIdx;

  const handleTouch = (locationX: number, locationY: number) => {
    const dx = locationX - radius;
    const dy = locationY - radius;
    let angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
    if (angle < -90) angle = -90;
    if (angle > 90) angle = 90;
    const idx = Math.round((angle + 90) / angleStep);
    const clamped = Math.max(0, Math.min(options.length - 1, idx));
    if (clamped !== lastIdxRef.current) {
      Haptics.selectionAsync();
      lastIdxRef.current = clamped;
      onChange(options[clamped].key);
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

  return (
    <View
      style={{
        width: containerW,
        height: containerH,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
      }}
    >
      {options.map((opt, i) => {
        const angle = angleForIdx(i);
        const active = !isDefault && activeIdx === i;
        return (
          <View
            key={`l${opt.key}`}
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: containerH / 2 - 16,
              left: containerW / 2 - labelWidth / 2,
              width: labelWidth,
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'visible',
              transform: [
                { rotate: `${angle}deg` },
                { translateY: -labelR },
                { rotate: `${-angle}deg` },
              ],
            }}
          >
            {opt.render ? (
              opt.render({ color: POINTER_WHITE, opacity: active ? 1 : 0.85, size: active ? 24 : 22 })
            ) : opt.icon ? (
              <MaterialCommunityIcons
                name={opt.icon}
                size={active ? 16 : 14}
                color={POINTER_WHITE}
                style={{ opacity: active ? 1 : 0.92 }}
              />
            ) : (
              <Text
                style={{
                  fontFamily: 'monospace',
                  fontSize: active ? 11 : 9.5,
                  fontWeight: 'bold',
                  color: POINTER_WHITE,
                  opacity: active ? 1 : 0.92,
                  textAlign: 'center',
                }}
              >
                {opt.label}
              </Text>
            )}
          </View>
        );
      })}

      <View
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        {...panResponder.panHandlers}
      >
        <View
          style={{
            position: 'absolute',
            width: size, height: size,
            borderRadius: radius,
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
            width: size - 8, height: size - 8,
            borderRadius: (size - 8) / 2,
            borderWidth: 1,
            borderColor: KNOB_INNER,
            backgroundColor: 'transparent',
          }}
        />

        {options.map((opt, i) => {
          const angle = angleForIdx(i);
          const active = !isDefault && activeIdx === i;
          const color = dashColorFn ? dashColorFn(i, active) : (active ? DASH_NEUTRAL_BRIGHT : DASH_NEUTRAL);
          return (
            <View
              key={`d${opt.key}`}
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: radius, left: radius,
                width: 0, height: 0,
                transform: [
                  { rotate: `${angle}deg` },
                  { translateY: -dashR },
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

        <Animated.View
          pointerEvents="none"
          style={[{
            position: 'absolute',
            top: radius, left: radius,
            width: 0, height: 0,
          }, pointerAnimStyle]}
        >
          <View
            style={{
              width: 12,
              height: radius - 8,
              backgroundColor: '#1a2940',
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
              borderBottomLeftRadius: 3,
              borderBottomRightRadius: 3,
              borderWidth: 1,
              borderColor: '#2a3b56',
              marginLeft: -6,
              marginTop: -(radius - 8) + 6,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.55,
              shadowRadius: 3,
              elevation: 4,
              opacity: isDefault ? 0.7 : 1,
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: 3,
              height: radius - 24,
              backgroundColor: '#2e405d',
              borderRadius: 1.5,
              marginLeft: -1.5,
              top: -(radius - 8) + 14,
              left: 0,
              opacity: isDefault ? 0.7 : 1,
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: -(radius - 4),
              left: 0,
              width: 0, height: 0,
              borderLeftWidth: 6,
              borderRightWidth: 6,
              borderBottomWidth: 9,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: POINTER_WHITE,
              marginLeft: -6,
              opacity: isDefault ? 0.65 : 1,
            }}
          />
        </Animated.View>

        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: radius - 5, left: radius - 5,
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

const TEMP_OPTIONS: KnobOption[] = TEMP_STEPS.map((t) => ({ key: String(t), label: String(t) }));
const FAN_OPTIONS: KnobOption[] = [
  { key: 'off', label: 'OFF' },
  { key: '1', label: '1' },
  { key: '2', label: '2' },
  { key: '3', label: '3' },
  { key: '4', label: '4' },
  { key: '5', label: '5' },
  { key: '6', label: '6' },
  { key: '7', label: '7' },
  { key: 'auto', icon: 'fan-auto' },
];
const VENT_OPTIONS: KnobOption[] = [
  { key: 'face', render: (p) => <FaceVentIcon color={p.color} opacity={p.opacity} /> },
  { key: 'mix', render: (p) => <MixVentIcon color={p.color} opacity={p.opacity} /> },
  { key: 'feet', render: (p) => <FeetVentIcon color={p.color} opacity={p.opacity} /> },
  { key: 'defrost', render: (p) => <DefrostVentIcon color={p.color} opacity={p.opacity} /> },
];

function TempKnob({
  value, onChange,
}: {
  value?: number;
  onChange: (v: number) => void;
}) {
  return (
    <Knob
      options={TEMP_OPTIONS}
      activeKey={value !== undefined ? String(value) : undefined}
      onChange={(k) => onChange(parseInt(k, 10))}
      labelWidth={16}
      dashColorFn={dashColor}
    />
  );
}

function FanKnob({
  value, onChange,
}: {
  value?: number | 'auto';
  onChange: (v: number | 'auto') => void;
}) {
  const activeKey =
    value === 'auto' ? 'auto'
    : value === 0 ? 'off'
    : typeof value === 'number' ? String(value)
    : undefined;
  return (
    <View style={{ alignItems: 'center' }}>
      <Knob
        options={FAN_OPTIONS}
        activeKey={activeKey}
        onChange={(k) => {
          if (k === 'auto') onChange('auto');
          else if (k === 'off') onChange(0 as any);
          else onChange(parseInt(k, 10));
        }}
        labelWidth={22}
      />
    </View>
  );
}

function VentKnob({
  value, onChange,
}: {
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Knob
        options={VENT_OPTIONS}
        activeKey={value}
        onChange={(k) => onChange(k)}
        labelWidth={36}
      />
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

function CircleButton({
  size = 58,
  label,
  icon,
  image,
  state,
  onPress,
}: {
  size?: number;
  label?: string;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  image?: any;
  state: 'off' | 'on' | 'auto';
  onPress: () => void;
}) {
  const active = state !== 'off';
  const tint = state === 'on' ? KNOB_DISC : POINTER_WHITE;
  return (
    <Pressable
      onPress={async () => { await Haptics.selectionAsync(); onPress(); }}
      style={{
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: state === 'on' ? POINTER_WHITE : KNOB_DISC,
        borderWidth: 1.5,
        borderColor: state === 'auto' ? POINTER_WHITE : KNOB_RIM,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.55, shadowRadius: 6,
        elevation: 6,
      }}
    >
      {image ? (
        <Image
          source={image}
          style={{ width: size * 0.55, height: size * 0.55, opacity: active ? 1 : 0.85 }}
          contentFit="contain"
          tintColor={tint}
        />
      ) : icon ? (
        <MaterialCommunityIcons
          name={icon}
          size={size * 0.42}
          color={tint}
          style={{ opacity: active ? 1 : 0.85 }}
        />
      ) : (
        <Text style={{
          fontFamily: 'monospace',
          fontSize: size * 0.27,
          fontWeight: 'bold',
          color: state === 'on' ? KNOB_DISC : POINTER_WHITE,
          letterSpacing: 1.2,
          opacity: active ? 1 : 0.85,
        }}>
          {label}
        </Text>
      )}
      {state === 'auto' && (
        <View style={{
          position: 'absolute', bottom: -6,
          paddingHorizontal: 4, paddingVertical: 1,
          borderRadius: 3,
          backgroundColor: KNOB_DISC,
          borderWidth: 1, borderColor: POINTER_WHITE,
        }}>
          <Text style={{
            fontFamily: 'monospace', fontSize: 6,
            color: POINTER_WHITE,
            fontWeight: 'bold',
            letterSpacing: 1,
          }}>
            AUTO
          </Text>
        </View>
      )}
    </Pressable>
  );
}

function cycleTriState(current: 'on' | 'off' | 'auto' | undefined): 'on' | 'off' | 'auto' {
  if (current === 'off' || current === undefined) return 'on';
  if (current === 'on') return 'auto';
  return 'off';
}

function AutoPill({
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
        paddingHorizontal: 18,
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
          fontSize: 11,
          fontWeight: 'bold',
          color: active ? KNOB_DISC : POINTER_WHITE,
          letterSpacing: 2.5,
        }}
      >
        AUTO
      </Text>
    </Pressable>
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
          <View style={{ alignItems: 'center', marginTop: 4 }}>
            <FanKnob
              value={answers.fanSpeed}
              onChange={(v) => set('fanSpeed', v as any)}
            />
          </View>

          {/* VENT DIRECTION */}
          <SectionLabel icon="weather-windy">Vent Direction</SectionLabel>
          <View style={{ alignItems: 'center', marginTop: 4 }}>
            <VentKnob
              value={answers.ventDirection}
              onChange={(v) => set('ventDirection', v as any)}
            />
          </View>

          {/* AIR — A/S + Recirc circular buttons */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 18, marginBottom: 14, paddingHorizontal: 30 }}>
            <View style={{ alignItems: 'center' }}>
              <CircleButton
                label="A/S"
                state={(answers.acCompressor as any) ?? 'off'}
                onPress={() => set('acCompressor', cycleTriState(answers.acCompressor))}
              />
              <Text style={{
                fontFamily: 'monospace', fontSize: 8,
                color: C.silkDim, letterSpacing: 2, marginTop: 14,
                textTransform: 'uppercase',
              }}>
                A/C
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <CircleButton
                image={RECIRC_PNG}
                state={(answers.recirc as any) ?? 'off'}
                onPress={() => set('recirc', cycleTriState(answers.recirc))}
              />
              <Text style={{
                fontFamily: 'monospace', fontSize: 8,
                color: C.silkDim, letterSpacing: 2, marginTop: 14,
                textTransform: 'uppercase',
              }}>
                Recirc
              </Text>
            </View>
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
            color: allAnswered ? '#0a0e14' : C.silk,
          }}>
            {allAnswered ? 'Submit Configuration' : `${remainingCount} setting${remainingCount === 1 ? '' : 's'} remaining`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
