import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { CARS, CarEntry, MAKES, DashboardStyle } from '../data/cars';
import { useClimateStore } from '../lib/store';
import { getBrandLogo, hasBrandLogo } from '../lib/brandLogos';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const STYLE_ICON: Record<DashboardStyle, IconName> = {
  compact: 'car-hatchback',
  sedan: 'car-side',
  suv: 'car-estate',
  truck: 'truck',
  luxury: 'car-sports',
};

const C = {
  bg:        '#0a0e14',
  bg2:       '#14191f',
  bg3:       '#1f262e',
  tile:      '#1c232b',
  tileHi:    '#262e38',
  tileLo:    '#0d1218',
  gold:      '#c9a875',
  goldBright:'#e8c98a',
  goldDim:   '#5a4730',
  text:      '#f0e9d8',
  textDim:   '#a8a193',
  textMuted: '#6b6760',
  divider:   'rgba(201, 168, 117, 0.12)',
  border:    'rgba(201, 168, 117, 0.22)',
};

function PillRow({
  badge, label, sub, onPress, idx,
}: {
  badge: React.ReactNode;
  label: string;
  sub?: string;
  onPress: () => void;
  idx: number;
}) {
  return (
    <Animated.View entering={FadeInDown.duration(360).delay(40 + idx * 28)}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.78}
        style={{
          flexDirection: 'row', alignItems: 'center', gap: 14,
          backgroundColor: C.tile,
          borderTopColor: C.tileHi, borderLeftColor: C.tileHi,
          borderBottomColor: C.tileLo, borderRightColor: C.tileLo,
          borderWidth: 1.5,
          paddingHorizontal: 14, paddingVertical: 12,
          marginBottom: 8,
          shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
        }}
      >
        {badge}
        <View style={{ flex: 1 }}>
          <Text style={{
            fontFamily: 'monospace', fontSize: 13, color: C.text,
            textTransform: 'uppercase', letterSpacing: 2.5, fontWeight: '600',
          }}>
            {label}
          </Text>
          {sub ? (
            <Text style={{
              fontFamily: 'monospace', fontSize: 9, color: C.gold,
              opacity: 0.75, marginTop: 2, letterSpacing: 1.5, textTransform: 'uppercase',
            }}>
              {sub}
            </Text>
          ) : null}
        </View>
        <Text style={{ fontFamily: 'monospace', fontSize: 18, color: C.gold, opacity: 0.6 }}>›</Text>
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

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Header */}
      <View style={{
        paddingTop: 60, paddingBottom: 18, paddingHorizontal: 24,
        borderBottomWidth: 1, borderBottomColor: C.divider,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontFamily: 'monospace', fontSize: 8, color: C.gold,
              opacity: 0.7, textTransform: 'uppercase', letterSpacing: 4, marginBottom: 6,
            }}>
              Step 1 of 2
            </Text>
            <Text style={{
              fontFamily: 'monospace', fontSize: 22, color: C.goldBright,
              fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 4,
              textShadowColor: C.gold, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 12,
            }}>
              {selectedMake ?? 'Vehicle'}
            </Text>
            {selectedMake && (
              <Text style={{
                fontFamily: 'monospace', fontSize: 10, color: C.textDim,
                marginTop: 4, letterSpacing: 2, textTransform: 'uppercase',
              }}>
                Select Model
              </Text>
            )}
          </View>
          <View style={{
            width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: C.gold,
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: C.bg2,
          }}>
            <Text style={{ fontFamily: 'monospace', fontSize: 11, color: C.gold, fontWeight: 'bold' }}>
              1
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        {!selectedMake ? (
          <Animated.View entering={FadeIn.duration(300)}>
            <Text style={{
              fontFamily: 'monospace', fontSize: 9, color: C.gold,
              opacity: 0.55, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 14,
            }}>
              Choose your make
            </Text>
            {MAKES.map((make, i) => {
              const logo = getBrandLogo(make);
              return (
                <PillRow
                  key={make}
                  idx={i}
                  badge={
                    <View style={{
                      width: 44, height: 44,
                      borderWidth: 1, borderColor: C.gold,
                      alignItems: 'center', justifyContent: 'center',
                      backgroundColor: 'rgba(10, 14, 20, 0.6)',
                      padding: 4,
                    }}>
                      {logo ? (
                        <Image source={logo} style={{ width: '100%', height: '100%' }} contentFit="contain" />
                      ) : (
                        <Text style={{ fontFamily: 'monospace', fontSize: 13, color: C.gold, fontWeight: 'bold' }}>
                          {make[0]}
                        </Text>
                      )}
                    </View>
                  }
                  label={make}
                  onPress={() => handleMake(make)}
                />
              );
            })}
          </Animated.View>
        ) : (
          <Animated.View entering={FadeIn.duration(300)}>
            <TouchableOpacity onPress={() => setSelectedMake(null)} style={{ marginBottom: 18 }}>
              <Text style={{
                fontFamily: 'monospace', fontSize: 10, color: C.gold,
                textTransform: 'uppercase', letterSpacing: 2.5,
              }}>
                ‹ Back to makes
              </Text>
            </TouchableOpacity>
            <Text style={{
              fontFamily: 'monospace', fontSize: 9, color: C.gold,
              opacity: 0.55, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 14,
            }}>
              {selectedMake} models
            </Text>
            {models.map((car, i) => {
              const features = [
                car.hasDualZone && 'Dual Zone',
                car.hasRearVents && 'Rear Vents',
              ].filter(Boolean).join(' · ');
              return (
                <PillRow
                  key={car.model}
                  idx={i}
                  badge={
                    <View style={{
                      width: 52, height: 36, borderWidth: 1, borderColor: C.gold,
                      alignItems: 'center', justifyContent: 'center',
                      backgroundColor: 'rgba(201, 168, 117, 0.08)',
                    }}>
                      <MaterialCommunityIcons name={STYLE_ICON[car.dashboardStyle]} size={22} color={C.goldBright} />
                    </View>
                  }
                  label={car.model}
                  sub={features || car.dashboardStyle + ' class'}
                  onPress={() => handleModel(car)}
                />
              );
            })}
          </Animated.View>
        )}
        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}
