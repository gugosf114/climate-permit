import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CARS, CarEntry, MAKES, DashboardStyle } from '../data/cars';
import { useClimateStore } from '../lib/store';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const STYLE_ICON: Record<DashboardStyle, IconName> = {
  compact: 'car-hatchback',
  sedan: 'car-side',
  suv: 'car-estate',
  truck: 'truck',
  luxury: 'car-sports',
};

const C = {
  ink: '#1a3a1a',
  paper: '#f4f0e6',
  rubber: '#8b2020',
  ledger: 'rgba(26, 58, 26, 0.06)',
};

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

  function MakeRow({ make, index }: { make: string; index: number }) {
    const fileNo = 1000 + index * 17;
    return (
      <TouchableOpacity
        style={{
          borderWidth: 1, borderColor: C.ink,
          paddingVertical: 14, paddingHorizontal: 18,
          marginBottom: 6,
          flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
          backgroundColor: index % 2 === 0 ? 'transparent' : C.ledger,
        }}
        onPress={() => handleMake(make)}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 }}>
          <View style={{
            width: 28, height: 28, borderWidth: 1, borderColor: C.ink,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ fontFamily: 'monospace', fontSize: 9, color: C.ink, fontWeight: 'bold' }}>
              {make[0]}
            </Text>
          </View>
          <View>
            <Text style={{ fontFamily: 'monospace', fontSize: 13, color: C.ink, textTransform: 'uppercase', letterSpacing: 2 }}>
              {make}
            </Text>
            <Text style={{ fontFamily: 'monospace', fontSize: 8, color: C.ink, opacity: 0.35, marginTop: 1, letterSpacing: 1 }}>
              MFR · FILE {String(fileNo).padStart(4, '0')}
            </Text>
          </View>
        </View>
        <Text style={{ fontFamily: 'monospace', fontSize: 16, color: C.ink, opacity: 0.4 }}>›</Text>
      </TouchableOpacity>
    );
  }

  function ModelRow({ car, index }: { car: CarEntry; index: number }) {
    const features = [
      car.hasDualZone && 'Dual Zone',
      car.hasRearVents && 'Rear Vents',
    ].filter(Boolean).join('  ·  ');
    return (
      <TouchableOpacity
        style={{
          borderWidth: 1, borderColor: C.ink,
          paddingVertical: 14, paddingHorizontal: 16,
          marginBottom: 6,
          flexDirection: 'row', alignItems: 'center', gap: 14,
          backgroundColor: index % 2 === 0 ? 'transparent' : C.ledger,
        }}
        onPress={() => handleModel(car)}
        activeOpacity={0.7}
      >
        <View style={{
          width: 44, height: 32, borderWidth: 1, borderColor: C.ink,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <MaterialCommunityIcons name={STYLE_ICON[car.dashboardStyle]} size={22} color={C.ink} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: 'monospace', fontSize: 13, color: C.ink, textTransform: 'uppercase', letterSpacing: 2 }}>
            {car.model}
          </Text>
          {features ? (
            <Text style={{ fontFamily: 'monospace', fontSize: 9, color: C.ink, opacity: 0.5, marginTop: 2, letterSpacing: 1 }}>
              {features}
            </Text>
          ) : (
            <Text style={{ fontFamily: 'monospace', fontSize: 9, color: C.ink, opacity: 0.35, marginTop: 2, letterSpacing: 1, textTransform: 'uppercase' }}>
              {car.dashboardStyle} class
            </Text>
          )}
        </View>
        <Text style={{ fontFamily: 'monospace', fontSize: 16, color: C.ink, opacity: 0.4 }}>›</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.paper }}>
      <View
        style={{
          paddingTop: 60, paddingBottom: 14, paddingHorizontal: 24,
          borderBottomWidth: 1, borderBottomColor: C.ink,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'monospace', fontSize: 9, color: C.ink, opacity: 0.5, textTransform: 'uppercase', letterSpacing: 2 }}>
              Step 1 of 2 — Vehicle Registration
            </Text>
            <Text style={{ fontFamily: 'monospace', fontSize: 18, color: C.ink, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginTop: 4 }}>
              {selectedMake ? `${selectedMake}` : 'Select Make'}
            </Text>
            {selectedMake && (
              <Text style={{ fontFamily: 'monospace', fontSize: 10, color: C.ink, opacity: 0.55, marginTop: 2, letterSpacing: 1, textTransform: 'uppercase' }}>
                Select Model
              </Text>
            )}
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <View style={{
              borderWidth: 1, borderColor: C.ink, paddingHorizontal: 6, paddingVertical: 2,
            }}>
              <Text style={{ fontFamily: 'monospace', fontSize: 7, color: C.ink, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                Form CL-1A
              </Text>
            </View>
            <Text style={{ fontFamily: 'monospace', fontSize: 7, color: C.ink, opacity: 0.45, marginTop: 4, letterSpacing: 1 }}>
              REV 04 · 2026
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 20 }}>
        {!selectedMake ? (
          <>
            <Text style={{ fontFamily: 'monospace', fontSize: 9, color: C.ink, opacity: 0.5, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
              — Vehicle Make —
            </Text>
            {MAKES.map((make, i) => (
              <MakeRow key={make} make={make} index={i} />
            ))}
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => setSelectedMake(null)} style={{ marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontFamily: 'monospace', fontSize: 10, color: C.rubber, textTransform: 'uppercase', letterSpacing: 2 }}>
                ‹ Back to Makes
              </Text>
            </TouchableOpacity>
            <Text style={{ fontFamily: 'monospace', fontSize: 9, color: C.ink, opacity: 0.5, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
              — {selectedMake} Models —
            </Text>
            {models.map((car, i) => (
              <ModelRow key={car.model} car={car} index={i} />
            ))}
          </>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
