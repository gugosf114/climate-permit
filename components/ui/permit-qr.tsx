import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { C } from '../../constants/palette';

// Scanners need DARK modules on a LIGHT field — an inverted (light-on-dark)
// QR is unreliable. We render deep-navy modules on a warm paper field, framed
// in gold so the light patch reads as an affixed official sticker on the card.
const QR_DARK = '#0a0e14';
const QR_LIGHT = '#efe7d4';

/**
 * Real scannable QR for the permit card. Encodes the app URL so the
 * shareable artifact actually links back.
 */
export function PermitQR({ value, size = 64 }: { value: string; size?: number }) {
  return (
    <View
      style={{
        padding: 5,
        backgroundColor: QR_LIGHT,
        borderWidth: 1,
        borderColor: C.gold,
      }}
    >
      <QRCode
        value={value}
        size={size}
        color={QR_DARK}
        backgroundColor={QR_LIGHT}
        ecl="M"
        quietZone={2}
      />
    </View>
  );
}
