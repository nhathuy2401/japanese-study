import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider } from '../src/stores/StoreContext';
import { AiTutorBottomSheet } from '../src/components/AiTutorBottomSheet';
import { colors } from '../src/theme/colors';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.dark.bgSurface },
            headerTintColor: colors.dark.textPrimary,
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: colors.dark.bgCanvas },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="lesson/[lessonId]"
            options={{ title: 'Bài học', presentation: 'modal' }}
          />
          <Stack.Screen
            name="pitch/[itemId]"
            options={{ title: 'Luyện Pitch Accent & Shadowing' }}
          />
        </Stack>
        <AiTutorBottomSheet />
      </StoreProvider>
    </SafeAreaProvider>
  );
}

