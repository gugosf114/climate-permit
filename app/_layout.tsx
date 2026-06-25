import '../global.css';
import { Stack, router } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Cinzel_700Bold,
  Cinzel_800ExtraBold,
} from '@expo-google-fonts/cinzel';
import { initAds } from '../lib/ads';
import { readInstallReferrer, parseCompatPayload } from '../lib/installReferrer';
import { useClimateStore } from '../lib/store';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Cinzel_700Bold,
    Cinzel_800ExtraBold,
  });

  useEffect(() => {
    initAds();
  }, []);

  // If the user installed via a "Test Your Partner" Play Store referrer,
  // read the compat payload and route them straight to the partner challenge screen.
  useEffect(() => {
    (async () => {
      const referrer = await readInstallReferrer();
      const payload = parseCompatPayload(referrer);
      if (!payload) return;
      // Only route if the user hasn't already taken their own quiz (avoid hijacking later launches).
      const store = useClimateStore.getState();
      if (store.archetypeId) return;
      // Defer one tick so the router is ready
      setTimeout(() => router.push(`/compat/${payload}`), 0);
    })();
  }, []);

  // Hold first paint until the display face is ready so hero type never
  // flashes a fallback. The native splash (deep navy) covers this gap.
  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0a0e14' },
          animation: 'slide_from_right',
        }}
      />
    </>
  );
}
