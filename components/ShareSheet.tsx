import { Share } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';

export async function shareImage(uri: string, fallbackText: string): Promise<void> {
  try {
    const dest = FileSystem.cacheDirectory + 'share_image.jpg';
    await FileSystem.copyAsync({ from: uri, to: dest });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(dest, { mimeType: 'image/jpeg' });
    } else {
      Share.share({ message: fallbackText });
    }
  } catch {
    Share.share({ message: fallbackText });
  }
}
