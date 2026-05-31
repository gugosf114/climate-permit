import '../global.css';
import { Stack, router } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { initAds } from '../lib/ads';
import { readInstallReferrer, parseCompatPayload } from '../lib/installReferrer';
import { useClimateStore } from '../lib/store';

export default function RootLayout() {
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
