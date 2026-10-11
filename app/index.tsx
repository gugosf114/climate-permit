import { View, Text, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useDMV, useThemeName, useThemeStore } from '../constants/tokens';
import { OfficialHeader, DocumentBackground } from '../components/Chrome';

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
        <Text style={{ fontFamily: 'monospace', fontSize: 10, color: DMV.caBlue, letterSpacing: 1.5 }}>
          {themeName === 'dark' ? '\u2600 DAY WINDOW' : '\u263e NIGHT SERVICE'}
        </Text>
      </TouchableOpacity>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 26, paddingBottom: 40 }}
      >
        <Animated.View entering={FadeInDown.duration(600).delay(100)}>
          <Text style={{
            fontFamily: 'monospace', fontSize: 10, color: DMV.caBlue,
            fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 6,
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
              fontFamily: 'monospace', fontSize: 10,
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
            backgroundColor: DMV.noticeWash,
          }}>
            <Text style={{
              fontFamily: 'monospace', fontSize: 10, color: DMV.caBlue,
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
                fontFamily: 'monospace', fontSize: 10,
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
                fontFamily: 'monospace', fontSize: 10,
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
                fontFamily: 'monospace', fontSize: 10,
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
              elevation: 3,
            }}
          >
            <Text style={{
              fontFamily: undefined, fontSize: 14,
              color: DMV.paperLight, fontWeight: 'bold',
              letterSpacing: 1.5, textTransform: 'uppercase',
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
              fontFamily: 'monospace', fontSize: 10,
              color: DMV.inkDim, letterSpacing: 1.5, fontWeight: 'bold',
            }}>
              AUTHORIZED
            </Text>
            <View style={{ height: 1, flex: 1, backgroundColor: DMV.divider }} />
          </View>
          <Text style={{
            fontFamily: 'monospace', fontSize: 10, color: DMV.inkDim,
            lineHeight: 15, letterSpacing: 0.5, textAlign: 'center',
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
