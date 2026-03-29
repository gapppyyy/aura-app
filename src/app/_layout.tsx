import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import '@/i18n'; // Init i18n
import { StatusBar } from 'expo-status-bar';
import { AuraProvider } from '@/context/AuraContext';

export default function RootLayout() {
  return (
    <AuraProvider>
      <ThemeProvider value={DarkTheme}>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="scan" />
          <Stack.Screen name="processing" />
          <Stack.Screen name="results" />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </AuraProvider>
  );
}
