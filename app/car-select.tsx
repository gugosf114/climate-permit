import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { CARS, CarEntry, MAKES, DashboardStyle } from '../data/cars';
import { useClimateStore } from '../lib/store';
import { getBrandLogo } from '../lib/brandLogos';
import { useDMV, DMV_LIGHT } from '../constants/tokens';
import { OfficialHeader, DocumentBackground, SectionHeader } from '../components/Chrome';


type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const STYLE_ICON: Record<DashboardStyle, IconName> = {
  compact: 'car-hatchback',
  sedan: 'car-side',
  suv: 'car-estate',
  truck: 'truck',
  luxury: 'car-sports',
};

function PaperRow({
  badge, label, sub, onPress, idx,
}: {
  badge: React.ReactNode;
  label: string;
  sub?: string;
  onPress: () => void;
  idx: number;
}) {
  const DMV = useDMV();
  return (
    <Animated.View entering={FadeInDown.duration(320).delay(20 + idx * 22)}>
      <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
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
          elevation: 1,
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
              fontFamily: 'monospace', fontSize: 10, color: DMV.caBlue,
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
  const DMV = useDMV();
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
        <SectionHeader
          kicker={`SECTION ${sectionNum} · VEHICLE`}
          title={sectionTitle}
          subtitle={selectedMake
            ? 'Please indicate the model of the vehicle to be operated.'
            : 'Please indicate the make of the vehicle to be operated.'}
          boxChar="1"
        />
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
                      // brand logos are dark art: keep the badge on cream paper in both themes
                      backgroundColor: DMV_LIGHT.paperLight,
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
