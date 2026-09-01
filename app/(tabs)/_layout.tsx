import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useSettingsStore } from '../../src/stores/StoreContext';
import { colors } from '../../src/theme/colors';

export default observer(function TabLayout() {
  const settings = useSettingsStore();
  const theme = settings?.currentTheme || colors.dark;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.bgSurface,
          borderTopColor: theme.borderSubtle,
          height: 62,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hôm nay',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '🏠' : '🏚️'}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Lộ trình',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '🗺️' : '🧭'}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          title: 'Ôn tập',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '📦' : '🎴'}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="vocabulary"
        options={{
          title: 'Từ vựng',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '📗' : '📘'}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="notebook"
        options={{
          title: 'Sổ tay',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '⭐' : '☆'}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Cài đặt',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '⚙️' : '🔧'}</Text>
          ),
        }}
      />
    </Tabs>
  );
});
