import '../global.css';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { initAds } from '../lib/ads';

export default function RootLayout() {
  useEffect(() => {
    initAds();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#f4f0e6' },
          animation: 'slide_from_right',
        }}
      />
    </>
  );
}
