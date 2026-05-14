import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';

interface Props {
  number: string;
  label: string;
  options: string[];
  value?: string;
  onChange: (value: string) => void;
}

export function DashboardKnob({ number, label, options, value, onChange }: Props) {
  async function handlePress(opt: string) {
    await Haptics.selectionAsync();
    onChange(opt);
  }

  return (
    <View
      style={{
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#2d5a2d',
        padding: 14,
      }}
    >
      <Text
        style={{
          fontFamily: 'monospace', fontSize: 9, color: '#f4f0e6',
          textTransform: 'uppercase', letterSpacing: 2, opacity: 0.5, marginBottom: 10,
        }}
      >
        {number}  {label}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {options.map((opt) => {
            const active = value === opt;
            return (
              <TouchableOpacity
                key={opt}
                onPress={() => handlePress(opt)}
                activeOpacity={0.7}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: active ? '#f4f0e6' : '#2d5a2d',
                  backgroundColor: active ? '#f4f0e6' : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    color: active ? '#1a3a1a' : '#f4f0e6',
                    fontWeight: active ? 'bold' : 'normal',
                  }}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
