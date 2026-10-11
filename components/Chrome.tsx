/**
 * Shared DMV document chrome: the official header band, the watermarked
 * form background, the CA grizzly, and the numbered section header.
 * Every screen imports these — sizes and spacing must never drift again.
 */
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { useDMV } from '../constants/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BEAR_PNG = require('../assets/images/bear.png');

/** The California grizzly — the same bear as the app icon, tinted. */
export function BearSilhouette({ size, color }: { size: number; color: string }) {
  return (
    <Image
      source={BEAR_PNG}
      style={{ width: size, height: size * (400 / 595) }}
      contentFit="contain"
      tintColor={color}
    />
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
