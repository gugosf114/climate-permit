import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { CARS, CarEntry, MAKES } from '../data/cars';
import { useClimateStore } from '../lib/store';

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

  const Row = ({ label, subtitle, onPress }: { label: string; subtitle?: string; onPress: () => void }) => (
    <TouchableOpacity
      style={{
        borderWidth: 1, borderColor: '#1a3a1a',
        paddingVertical: 14, paddingHorizontal: 18,
        marginBottom: 6,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View>
        <Text style={{ fontFamily: 'monospace', fontSize: 13, color: '#1a3a1a', textTransform: 'uppercase', letterSpacing: 2 }}>
          {label}
        </Text>
        {subtitle ? (
          <Text style={{ fontFamily: 'monospace', fontSize: 9, color: '#1a3a1a', opacity: 0.45, marginTop: 2, letterSpacing: 1 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <Text style={{ fontFamily: 'monospace', fontSize: 16, color: '#1a3a1a', opacity: 0.4 }}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f4f0e6' }}>
      <View
        style={{
          paddingTop: 60, paddingBottom: 14, paddingHorizontal: 24,
          borderBottomWidth: 1, borderBottomColor: '#1a3a1a',
        }}
      >
        <Text style={{ fontFamily: 'monospace', fontSize: 9, color: '#1a3a1a', opacity: 0.5, textTransform: 'uppercase', letterSpacing: 2 }}>
          Step 1 of 2 — Vehicle Registration
        </Text>
        <Text style={{ fontFamily: 'monospace', fontSize: 18, color: '#1a3a1a', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginTop: 4 }}>
          {selectedMake ? `${selectedMake} — Select Model` : 'Select Make'}
        </Text>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 20 }}>
        {!selectedMake ? (
          <>
            <Text style={{ fontFamily: 'monospace', fontSize: 9, color: '#1a3a1a', opacity: 0.5, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
              — Vehicle Make —
            </Text>
            {MAKES.map((make) => (
              <Row key={make} label={make} onPress={() => handleMake(make)} />
            ))}
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => setSelectedMake(null)} style={{ marginBottom: 16 }}>
              <Text style={{ fontFamily: 'monospace', fontSize: 10, color: '#8b2020', textTransform: 'uppercase', letterSpacing: 2 }}>
                ‹ Back to Makes
              </Text>
            </TouchableOpacity>
            <Text style={{ fontFamily: 'monospace', fontSize: 9, color: '#1a3a1a', opacity: 0.5, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
              — {selectedMake} Models —
            </Text>
            {models.map((car) => {
              const features = [
                car.hasDualZone && 'Dual Zone',
                car.hasRearVents && 'Rear Vents',
              ].filter(Boolean).join('  ·  ');
              return (
                <Row
                  key={car.model}
                  label={car.model}
                  subtitle={features || undefined}
                  onPress={() => handleModel(car)}
                />
              );
            })}
          </>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
