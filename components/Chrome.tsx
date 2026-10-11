/**
 * Shared DMV document chrome: the official header band, the watermarked
 * form background, the CA grizzly, and the numbered section header.
 * Every screen imports these — sizes and spacing must never drift again.
 */
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useDMV } from '../constants/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** California grizzly bear silhouette (walking pose, star above the shoulder). */
export function BearSilhouette({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size * 0.55} viewBox="0 0 100 55">
      <Path
        d="M 4 32 C 3 30, 4 27, 8 25 L 11 22 C 13 19, 16 17, 19 19 L 20 14 L 23 19 L 25 14 L 28 19 C 33 14, 41 11, 48 11 C 58 11, 68 13, 77 17 C 84 20, 89 24, 91 27 L 94 24 L 96 28 L 91 30 C 89 36, 86 41, 83 43 L 83 49 C 81 50, 78 50, 76 49 L 76 44 C 70 45, 64 45, 58 44 L 50 49 C 48 50, 45 50, 43 49 L 43 44 L 26 44 L 18 49 C 16 50, 13 50, 11 49 L 11 44 C 8 43, 5 38, 4 34 Z"
        fill={color}
      />
      <Path
        d="M 55 20 L 56.8 24 L 61 24 L 57.6 26.6 L 58.8 31 L 55 28.4 L 51.2 31 L 52.4 26.6 L 49 24 L 53.2 24 Z"
        fill={color}
      />
    </Svg>
  );
}

/** The masthead band: italic "California", USA, gold bear + wordmark. */
export function OfficialHeader() {
  const insets = useSafeAreaInsets();
  const DMV = useDMV();
  return (
    <View style={{
      paddingTop: insets.top + 12, paddingBottom: 10, paddingHorizontal: 22,
      borderBottomWidth: 1, borderBottomColor: DMV.divider,
      backgroundColor: DMV.headerBand,
      flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
        <Text style={{
          fontFamily: 'serif', fontStyle: 'italic',
          fontSize: 28, color: DMV.caBlue, fontWeight: 'bold',
          lineHeight: 30, letterSpacing: -0.5,
        }}>
          California
        </Text>
        <Text style={{
          fontFamily: 'monospace', fontSize: 10, color: DMV.ink,
          fontWeight: 'bold', letterSpacing: 1, marginLeft: 3, marginBottom: 5,
        }}>
          USA
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <BearSilhouette size={32} color={DMV.gold} />
        <Text style={{
          fontFamily: undefined, fontSize: 10,
          color: DMV.caBlue, fontWeight: 'bold', letterSpacing: 1, marginTop: 2,
        }}>
          CLIMATE PERMIT
        </Text>
      </View>
    </View>
  );
}

/** The paper behind form screens: one faint grizzly, nothing else. */
export function DocumentBackground() {
  const DMV = useDMV();
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <View style={{
        position: 'absolute', bottom: 48, right: -30,
        opacity: 0.06,
      }}>
        <BearSilhouette size={300} color={DMV.caBlueDeep} />
      </View>
    </View>
  );
}

/** Numbered form-section header: kicker, title, optional subtitle, the
 *  red-boxed section number, and the red rule underneath. */
export function SectionHeader({
  kicker, title, subtitle, boxChar, kickerColor,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  boxChar: string;
  kickerColor?: string;
}) {
  const DMV = useDMV();
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontFamily: 'monospace', fontSize: 10, color: kickerColor ?? DMV.caBlue,
            fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 4,
          }}>
            {kicker}
          </Text>
          <Text style={{
            fontFamily: undefined, fontSize: 22, color: DMV.ink,
            fontWeight: 'bold', letterSpacing: -0.3,
          }}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={{
              fontFamily: undefined, fontSize: 13, color: DMV.inkSoft,
              marginTop: 4, fontWeight: '500', lineHeight: 18,
            }}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View style={{
          width: 32, height: 32,
          borderWidth: 1.5, borderColor: DMV.red,
          alignItems: 'center', justifyContent: 'center',
          backgroundColor: DMV.paperLight,
        }}>
          <Text style={{ fontFamily: 'monospace', fontSize: 14, color: DMV.red, fontWeight: 'bold' }}>
            {boxChar}
          </Text>
        </View>
      </View>
      <View style={{ height: 3, width: 56, backgroundColor: DMV.red, marginTop: 10 }} />
    </View>
  );
}
