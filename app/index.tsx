import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useDMV, useThemeName, useThemeStore } from '../constants/tokens';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


function BearSilhouette({ size, color }: { size: number; color: string }) {
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

function DocumentBackground() {
  const DMV = useDMV();
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <Text style={{
        position: 'absolute',
        top: '40%', left: -40, right: -40,
        fontWeight: 'bold',
        fontSize: 42,
        color: DMV.caBlue,
        opacity: 0.06,
        letterSpacing: 10,
        textAlign: 'center',
        transform: [{ rotate: '-8deg' }],
      }}>
        STATE OF CALIFORNIA
      </Text>

      {Array.from({ length: 14 }).map((_, i) => (
        <Text key={`r${i}`} style={{
          position: 'absolute', left: 0, right: 0,
          top: 70 + i * 60,
          fontSize: 8, fontWeight: 'bold',
          color: DMV.caBlue, opacity: 0.055,
          letterSpacing: 2.5,
          textAlign: 'center',
        }}>
          STATE OF CALIFORNIA · STATE OF CALIFORNIA · STATE OF CALIFORNIA · STATE OF CALIFORNIA
        </Text>
      ))}

      <View style={{
        position: 'absolute', top: '40%', left: 0, right: 0,
        alignItems: 'center', opacity: 0.05,
      }}>
        <BearSilhouette size={260} color={DMV.caBlueDeep} />
      </View>

      <View style={{ position: 'absolute', top: 220, right: 30, opacity: 0.08 }}>
        <BearSilhouette size={50} color={DMV.gold} />
      </View>
      <View style={{ position: 'absolute', bottom: 200, left: 24, opacity: 0.08 }}>
        <BearSilhouette size={50} color={DMV.gold} />
      </View>

      {Array.from({ length: 32 }).map((_, i) => (
        <View key={`g${i}`} style={{
          position: 'absolute', left: 0, right: 0,
          top: i * 24, height: 1,
          backgroundColor: DMV.gold, opacity: 0.04,
        }} />
      ))}
    </View>
  );
}

function OfficialHeader() {
  const insets = useSafeAreaInsets();
  const DMV = useDMV();
  return (
    <View style={{
      paddingTop: insets.top + 12, paddingBottom: 10, paddingHorizontal: 22,
      borderBottomWidth: 1, borderBottomColor: DMV.divider,
      backgroundColor: 'rgba(251,246,230,0.92)',
      flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
        <Text style={{
          fontFamily: 'serif', fontStyle: 'italic',
          fontSize: 30, color: DMV.caBlue, fontWeight: 'bold',
          lineHeight: 32, letterSpacing: -0.5,
        }}>
          California
        </Text>
        <Text style={{
          fontFamily: 'monospace', fontSize: 8, color: DMV.ink,
          fontWeight: 'bold', letterSpacing: 1, marginLeft: 3, marginBottom: 5,
        }}>
          USA
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <BearSilhouette size={36} color={DMV.gold} />
        <Text style={{
          fontFamily: undefined, fontSize: 11,
          color: DMV.caBlue, fontWeight: 'bold',
          letterSpacing: 1, marginTop: 2,
        }}>
          CLIMATE PERMIT
        </Text>
      </View>
    </View>
  );
}

export default function LandingScreen() {
  const DMV = useDMV();
  const themeName = useThemeName();
  const toggleTheme = useThemeStore((s) => s.toggle);
  const systemScheme = useColorScheme() ?? 'light';
  async function handleStart() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/car-select');
  }

  return (
    <View style={{ flex: 1, backgroundColor: DMV.paper }}>
      <DocumentBackground />
      <OfficialHeader />

      <TouchableOpacity
        onPress={() => toggleTheme(systemScheme)}
        accessibilityRole="switch"
        accessibilityState={{ checked: themeName === 'dark' }}
        accessibilityLabel="Night service mode"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={{
          alignSelf: 'flex-end', marginRight: 22, marginTop: 8,
          borderWidth: 1, borderColor: DMV.border,
          paddingVertical: 5, paddingHorizontal: 10,
          backgroundColor: DMV.paperLight,
        }}
      >
        <Text style={{ fontFamily: 'monospace', fontSize: 9, color: DMV.caBlue, letterSpacing: 1.5 }}>
          {themeName === 'dark' ? '\u2600 DAY WINDOW' : '\u263e NIGHT SERVICE'}
        </Text>
      </TouchableOpacity>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 26, paddingBottom: 40 }}
      >
        <Animated.View entering={FadeInDown.duration(600).delay(100)}>
          <Text style={{
            fontFamily: 'monospace', fontSize: 9, color: DMV.caBlue,
            fontWeight: 'bold', letterSpacing: 2.4, marginBottom: 6,
          }}>
            FORM  21-B  ·  REV  04
          </Text>

          <Text style={{
            fontFamily: undefined, fontSize: 13, color: DMV.inkSoft,
            fontWeight: '600', letterSpacing: 0.5, marginBottom: 2,
          }}>
            APPLICATION FOR
          </Text>
          <Text style={{
            fontFamily: undefined, fontSize: 32,
            color: DMV.ink, fontWeight: 'bold',
            letterSpacing: -0.6, lineHeight: 36,
          }}>
            Climate Operator{'\n'}Permit
          </Text>

          <View style={{ flexDirection: 'row', marginTop: 14, marginBottom: 18, alignItems: 'center', gap: 6 }}>
            <View style={{ height: 4, width: 70, backgroundColor: DMV.red }} />
            <View style={{ height: 1, flex: 1, backgroundColor: DMV.caBlue, opacity: 0.5 }} />
            <Text style={{
              fontFamily: 'monospace', fontSize: 8,
              color: DMV.caBlue, fontWeight: 'bold', letterSpacing: 1.5,
            }}>
              DEPT · OF · CLIMATE · CONTROL
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(600).delay(250)}>
          <Text style={{
            fontFamily: undefined, fontSize: 15, color: DMV.ink,
            lineHeight: 22, marginBottom: 18, fontWeight: '500',
          }}>
            This permit is required for any operator wishing to lawfully configure the cabin climate of a motor vehicle within the State of California.
          </Text>

          <View style={{
            borderLeftWidth: 3, borderLeftColor: DMV.red,
            paddingLeft: 14, paddingVertical: 10, marginBottom: 14,
            backgroundColor: 'rgba(255,250,225,0.6)',
          }}>
            <Text style={{
              fontFamily: 'monospace', fontSize: 8, color: DMV.caBlue,
              fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 4,
            }}>
              SECTION 1 · ASSESSMENT NOTICE
            </Text>
            <Text style={{ fontFamily: undefined, fontSize: 14, color: DMV.ink, fontWeight: '600' }}>
              Estimated time: 60 seconds.
            </Text>
            <Text style={{ fontFamily: undefined, fontSize: 14, color: DMV.ink, marginTop: 2 }}>
              <Text style={{ color: DMV.red, fontWeight: 'bold' }}>Sixteen</Text>
              {' '}operator classifications available.
            </Text>
            <Text style={{ fontFamily: undefined, fontSize: 14, color: DMV.ink, marginTop: 2 }}>
              Partner compatibility assessment available upon issuance.
            </Text>
          </View>

          <View style={{
            flexDirection: 'row', gap: 12, marginBottom: 22,
            justifyContent: 'space-between',
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontFamily: 'monospace', fontSize: 8,
                color: DMV.caBlue, fontWeight: 'bold', letterSpacing: 1.5,
              }}>
                3 DOB
              </Text>
              <Text style={{ fontFamily: undefined, fontSize: 12, color: DMV.red, fontWeight: 'bold' }}>
                THE PRESENT
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontFamily: 'monospace', fontSize: 8,
                color: DMV.caBlue, fontWeight: 'bold', letterSpacing: 1.5,
              }}>
                4b EXP
              </Text>
              <Text style={{ fontFamily: undefined, fontSize: 12, color: DMV.red, fontWeight: 'bold' }}>
                12/31/2099
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontFamily: 'monospace', fontSize: 8,
                color: DMV.caBlue, fontWeight: 'bold', letterSpacing: 1.5,
              }}>
                12 REST
              </Text>
              <Text style={{ fontFamily: undefined, fontSize: 12, color: DMV.ink, fontWeight: 'bold' }}>
                NONE
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(450)}>
          <TouchableOpacity
            onPress={handleStart}
            activeOpacity={0.82}
            accessibilityRole="button"
            accessibilityLabel="Begin application"
            style={{
              backgroundColor: DMV.caBlue,
              paddingVertical: 19,
              alignItems: 'center',
              borderWidth: 1.5,
              borderColor: DMV.caBlueDeep,
              shadowColor: '#000',
              shadowOpacity: 0.18,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 3 },
            }}
          >
            <Text style={{
              fontFamily: undefined, fontSize: 14,
              color: DMV.paperLight, fontWeight: 'bold',
              letterSpacing: 3.5, textTransform: 'uppercase',
            }}>
              Begin Application
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(600).delay(650)} style={{ marginTop: 28 }}>
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8,
          }}>
            <View style={{ height: 1, flex: 1, backgroundColor: DMV.divider }} />
            <Text style={{
              fontFamily: 'monospace', fontSize: 8,
              color: DMV.inkDim, letterSpacing: 1.5, fontWeight: 'bold',
            }}>
              AUTHORIZED
            </Text>
            <View style={{ height: 1, flex: 1, backgroundColor: DMV.divider }} />
          </View>
          <Text style={{
            fontFamily: 'monospace', fontSize: 8, color: DMV.inkDim,
            lineHeight: 12.5, letterSpacing: 0.5, textAlign: 'center',
          }}>
            This is a parody application. Not affiliated with{'\n'}
            the California Department of Motor Vehicles{'\n'}
            or any governmental body. Submitted{'\n'}
            under penalty of comfort.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
