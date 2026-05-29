import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function LandingScreen() {
  async function handleStart() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/car-select');
  }

  return (
    <View className="flex-1 bg-paper items-center justify-center px-8">
      <View className="items-center mb-10">
        <Text
          style={{ fontFamily: 'monospace', fontSize: 10, color: '#1a3a1a', letterSpacing: 3, textTransform: 'uppercase', opacity: 0.6 }}
        >
          United States
        </Text>
        <Text
          style={{ fontFamily: 'monospace', fontSize: 10, color: '#1a3a1a', letterSpacing: 3, textTransform: 'uppercase', opacity: 0.6 }}
        >
          Department of
        </Text>
        <Text
          style={{ fontFamily: 'monospace', fontSize: 22, color: '#1a3a1a', fontWeight: 'bold', letterSpacing: 4, textTransform: 'uppercase', textAlign: 'center', marginTop: 4 }}
        >
          Climate{'\n'}Control
        </Text>
        <View style={{ width: '100%', height: 1, backgroundColor: '#1a3a1a', marginTop: 10, marginBottom: 8 }} />
        <Text
          style={{ fontFamily: 'monospace', fontSize: 9, color: '#1a3a1a', letterSpacing: 3, textTransform: 'uppercase', opacity: 0.6 }}
        >
          Operator Permit Division
        </Text>
        <Text
          style={{ fontFamily: 'monospace', fontSize: 10, color: '#1a3a1a', textAlign: 'center', marginTop: 18, lineHeight: 16, opacity: 0.75, paddingHorizontal: 6 }}
        >
          A satirical evaluation of your car's climate-control behavior. 60 seconds. 16 archetypes. Test your partner.
        </Text>
      </View>

      {/* Seal */}
      <View
        style={{
          width: 120, height: 120,
          borderRadius: 60,
          borderWidth: 3,
          borderColor: '#1a3a1a',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 40,
        }}
      >
        <View
          style={{
            width: 104, height: 104,
            borderRadius: 52,
            borderWidth: 1,
            borderColor: '#1a3a1a',
            borderStyle: 'dashed',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 36 }}>❄️</Text>
          <Text style={{ fontFamily: 'monospace', fontSize: 7, color: '#1a3a1a', letterSpacing: 2, textTransform: 'uppercase', marginTop: 2, opacity: 0.6 }}>
            CERTIFIED
          </Text>
        </View>
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={{
          backgroundColor: '#1a3a1a',
          paddingVertical: 18,
          width: '100%',
          alignItems: 'center',
          marginBottom: 16,
        }}
        onPress={handleStart}
        activeOpacity={0.85}
      >
        <Text
          style={{ fontFamily: 'monospace', fontSize: 12, color: '#f4f0e6', fontWeight: 'bold', letterSpacing: 3, textTransform: 'uppercase', textAlign: 'center' }}
        >
          Get Your Climate{'\n'}Operator Permit
        </Text>
      </TouchableOpacity>

      <Text
        style={{ fontFamily: 'monospace', fontSize: 9, color: '#1a3a1a', textAlign: 'center', opacity: 0.45, lineHeight: 15 }}
      >
        Warning: Results may be accurate.{'\n'}
        Not valid for aircraft or watercraft.{'\n'}
        climatepermit.app
      </Text>

      <Text
        style={{ fontFamily: 'monospace', fontSize: 8, color: '#1a3a1a', textAlign: 'center', opacity: 0.4, lineHeight: 13, marginTop: 14, letterSpacing: 1 }}
      >
        PARODY. NOT AFFILIATED WITH ANY{'\n'}GOVERNMENT AGENCY.
      </Text>
    </View>
  );
}
