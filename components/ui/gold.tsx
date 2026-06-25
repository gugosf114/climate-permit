import { TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, GRAD_TOP, GRAD_BOTTOM } from '../../constants/palette';

/** Pressable metallic-gold pill — bright sheen top, deep edge bottom. */
export function MetalButton({
  onPress,
  children,
  style,
  contentStyle,
  activeOpacity = 0.9,
  disabled,
}: {
  onPress?: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  activeOpacity?: number;
  disabled?: boolean;
}) {
  const C = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={activeOpacity}
      disabled={disabled}
      style={[
        {
          shadowColor: C.gold,
          shadowOpacity: 0.5,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 6 },
          elevation: 6, // Android: shadow* is iOS-only, elevation gives real lift
        },
        style,
      ]}
    >
      <LinearGradient
        colors={C.goldGradient}
        start={GRAD_TOP}
        end={GRAD_BOTTOM}
        style={[
          {
            paddingVertical: 18,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1.5,
            borderTopColor: C.goldBright,
            borderLeftColor: C.goldBright,
            borderBottomColor: C.goldEdge,
            borderRightColor: C.goldEdge,
          },
          contentStyle,
        ]}
      >
        {children}
      </LinearGradient>
    </TouchableOpacity>
  );
}

/** Non-interactive metallic-gold surface (classification bars, badges). */
export function GoldSurface({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const C = useTheme();
  return (
    <LinearGradient
      colors={C.goldGradient}
      start={GRAD_TOP}
      end={GRAD_BOTTOM}
      style={[
        {
          borderWidth: 1.5,
          borderTopColor: C.goldBright,
          borderLeftColor: C.goldBright,
          borderBottomColor: C.goldDim,
          borderRightColor: C.goldDim,
        },
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );
}
