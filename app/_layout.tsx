import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="update-password" />
        <Stack.Screen name="feed-selection" />
        <Stack.Screen name="operator" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}