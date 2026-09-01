import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { observer } from 'mobx-react-lite';
import { StoreProvider, useSettingsStore } from '../src/stores/StoreContext';
import { AiTutorBottomSheet } from '../src/components/AiTutorBottomSheet';
import { colors } from '../src/theme/colors';

const NavigationRoot = observer(() => {
  const settings = useSettingsStore();
  const theme = settings?.currentTheme || colors.dark;

  return (
    <>
      <StatusBar style={theme.mode === 'light' ? 'dark' : 'light'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.bgSurface },
          headerTintColor: theme.textPrimary,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: theme.bgCanvas },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="lesson/[lessonId]"
          options={{ title: 'Bài học', presentation: 'modal' }}
        />
        <Stack.Screen
          name="quiz/[unitId]"
          options={{ title: 'Bài kiểm tra', headerShown: false }}
        />
        <Stack.Screen
          name="pitch/[itemId]"
          options={{ title: 'Luyện Pitch Accent & Shadowing' }}
        />
      </Stack>
      <AiTutorBottomSheet />
    </>
  );
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <NavigationRoot />
      </StoreProvider>
    </SafeAreaProvider>
  );
}
