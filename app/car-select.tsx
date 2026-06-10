import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { CARS, CarEntry, MAKES, DashboardStyle } from '../data/cars';
import { useClimateStore } from '../lib/store';
import { getBrandLogo } from '../lib/brandLogos';

const DMV = {
  paper:       '#f5efde',
  paperLight:  '#fbf6e6',
  paperDeep:   '#ede4c2',
  border:      '#8a7a3a',
  caBlue:      '#0e2d63',
  caBlueSoft:  '#1e4385',
  caBlueDeep:  '#081c44',
  ink:         '#0a0a0a',
  inkSoft:     '#2c2c2c',
  inkDim:      '#7a7a7a',
  red:         '#b41d23',
  gold:        '#c78c19',
  goldDeep:    '#8b6310',
  hologram:    '#dba519',
  divider:     'rgba(20,20,20,0.18)',
  rowBorder:   'rgba(20,20,20,0.12)',
};

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const STYLE_ICON: Record<DashboardStyle, IconName> = {
  compact: 'car-hatchback',
  sedan: 'car-side',
  suv: 'car-estate',
  truck: 'truck',
  luxury: 'car-sports',
};

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
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <Text style={{
        position: 'absolute', top: '50%', left: -40, right: -40,
        fontWeight: 'bold', fontSize: 38, color: DMV.caBlue,
        opacity: 0.05, letterSpacing: 9, textAlign: 'center',
        transform: [{ rotate: '-6deg' }],
      }}>
        STATE OF CALIFORNIA
      </Text>
      {Array.from({ length: 16 }).map((_, i) => (
        <Text key={`r${i}`} style={{
          position: 'absolute', left: 0, right: 0,
          top: 70 + i * 56,
          fontSize: 7, fontWeight: 'bold',
          color: DMV.caBlue, opacity: 0.05,
          letterSpacing: 2.5, textAlign: 'center',
        }}>
          STATE OF CALIFORNIA · STATE OF CALIFORNIA · STATE OF CALIFORNIA · STATE OF CALIFORNIA
        </Text>
      ))}
      <View style={{ position: 'absolute', top: '38%', left: 0, right: 0, alignItems: 'center', opacity: 0.04 }}>
        <BearSilhouette size={240} color={DMV.caBlueDeep} />
      </View>
      <View style={{ position: 'absolute', bottom: 80, right: 18, opacity: 0.08 }}>
        <BearSilhouette size={42} color={DMV.gold} />
      </View>
      {Array.from({ length: 30 }).map((_, i) => (
        <View key={`g${i}`} style={{
          position: 'absolute', left: 0, right: 0,
          top: i * 26, height: 1,
          backgroundColor: DMV.gold, opacity: 0.04,
        }} />
      ))}
    </View>
  );
}

function OfficialHeader() {
  return (
    <View style={{
      paddingTop: 50, paddingBottom: 10, paddingHorizontal: 22,
      borderBottomWidth: 1, borderBottomColor: DMV.divider,
      backgroundColor: 'rgba(251,246,230,0.92)',
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
          fontFamily: 'monospace', fontSize: 8, color: DMV.ink,
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

function PaperRow({
  badge, label, sub, onPress, idx,
}: {
  badge: React.ReactNode;
  label: string;
  sub?: string;
  onPress: () => void;
  idx: number;
}) {
  return (
    <Animated.View entering={FadeInDown.duration(320).delay(20 + idx * 22)}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={{
          flexDirection: 'row', alignItems: 'center', gap: 12,
          backgroundColor: DMV.paperLight,
          borderWidth: 1,
          borderColor: DMV.rowBorder,
          paddingHorizontal: 12, paddingVertical: 10,
          marginBottom: 7,
          shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 3, shadowOffset: { width: 0, height: 1 },
        }}
      >
        {badge}
        <View style={{ flex: 1 }}>
          <Text style={{
            fontFamily: undefined, fontSize: 15, color: DMV.ink,
            fontWeight: 'bold', letterSpacing: 0.2,
          }}>
            {label}
          </Text>
          {sub ? (
            <Text style={{
              fontFamily: 'monospace', fontSize: 9, color: DMV.caBlue,
              marginTop: 2, letterSpacing: 1, textTransform: 'uppercase', fontWeight: '600',
            }}>
              {sub}
            </Text>
          ) : null}
        </View>
        <Text style={{ fontFamily: undefined, fontSize: 22, color: DMV.caBlue, fontWeight: '300' }}>
          ›
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function CarSelectScreen() {
  const [selectedMake, setSelectedMake] = useState<string | null>(null);
  const setVehicle = useClimateStore((s) => s.setVehicle);

  const models = selectedMake ? CARS.filter((c) => c.make === selectedMake) : [];

  async function handleMake(make: string) {
    await Haptics.selectionAsync();
    setSelectedMake(make);
  }

  async function handleModel(car: CarEntry) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setVehicle(car.make, car.model, car.hasDualZone, car.hasRearVents, car.dashboardStyle);
    router.push('/dashboard');
  }

  const sectionNum = selectedMake ? '1.B' : '1.A';
  const sectionTitle = selectedMake ? `${selectedMake.toUpperCase()} · MODEL` : 'MAKE';

  return (
    <View style={{ flex: 1, backgroundColor: DMV.paper }}>
      <DocumentBackground />
      <OfficialHeader />

      <View style={{
        paddingTop: 18, paddingHorizontal: 22, paddingBottom: 12,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontFamily: 'monospace', fontSize: 9, color: DMV.caBlue,
              fontWeight: 'bold', letterSpacing: 2.2, marginBottom: 4,
            }}>
              SECTION {sectionNum} · VEHICLE
            </Text>
            <Text style={{
              fontFamily: undefined, fontSize: 22, color: DMV.ink,
              fontWeight: 'bold', letterSpacing: -0.3,
            }}>
              {sectionTitle}
            </Text>
            <Text style={{
              fontFamily: undefined, fontSize: 13, color: DMV.inkSoft,
              marginTop: 4, fontWeight: '500',
            }}>
              {selectedMake
                ? 'Please indicate the model of the vehicle to be operated.'
                : 'Please indicate the make of the vehicle to be operated.'}
            </Text>
          </View>
          <View style={{
            width: 32, height: 32,
            borderWidth: 1.5, borderColor: DMV.red,
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: DMV.paperLight,
          }}>
            <Text style={{ fontFamily: 'monospace', fontSize: 14, color: DMV.red, fontWeight: 'bold' }}>
              1
            </Text>
          </View>
        </View>
        <View style={{ height: 3, width: 56, backgroundColor: DMV.red, marginTop: 10 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 60 }}>
        {!selectedMake ? (
          <Animated.View entering={FadeIn.duration(280)}>
            {MAKES.map((make, i) => {
              const logo = getBrandLogo(make);
              return (
                <PaperRow
                  key={make}
                  idx={i}
                  badge={
                    <View style={{
                      width: 42, height: 42,
                      borderWidth: 1, borderColor: DMV.border,
                      alignItems: 'center', justifyContent: 'center',
                      backgroundColor: DMV.paper,
                      padding: 4,
                    }}>
                      {logo ? (
                        <Image source={logo} style={{ width: '100%', height: '100%' }} contentFit="contain" />
                      ) : (
                        <Text style={{ fontFamily: 'serif', fontSize: 18, color: DMV.caBlue, fontWeight: 'bold' }}>
                          {make[0]}
                        </Text>
                      )}
                    </View>
                  }
                  label={make}
                  sub="REGISTERED MAKE"
                  onPress={() => handleMake(make)}
                />
              );
            })}
          </Animated.View>
        ) : (
          <Animated.View entering={FadeIn.duration(280)}>
            <TouchableOpacity onPress={() => setSelectedMake(null)} style={{ marginBottom: 14, paddingVertical: 4 }}>
              <Text style={{
                fontFamily: 'monospace', fontSize: 10, color: DMV.caBlue,
                textTransform: 'uppercase', letterSpacing: 2, fontWeight: 'bold',
              }}>
                ‹ RETURN TO SECTION 1.A
              </Text>
            </TouchableOpacity>
            {models.map((car, i) => {
              const features = [
                car.hasDualZone && 'DUAL ZONE',
                car.hasRearVents && 'REAR VENTS',
              ].filter(Boolean).join(' · ') || `${car.dashboardStyle.toUpperCase()} CLASS`;
              return (
                <PaperRow
                  key={car.model}
                  idx={i}
                  badge={
                    <View style={{
                      width: 50, height: 34, borderWidth: 1, borderColor: DMV.border,
                      alignItems: 'center', justifyContent: 'center',
                      backgroundColor: DMV.paperLight,
                    }}>
                      <MaterialCommunityIcons name={STYLE_ICON[car.dashboardStyle]} size={20} color={DMV.caBlue} />
                    </View>
                  }
                  label={car.model}
                  sub={features}
                  onPress={() => handleModel(car)}
                />
              );
            })}
          </Animated.View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
