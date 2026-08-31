import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { colors } from '../../src/theme/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.dark.bgSurface,
          borderTopColor: colors.dark.borderSubtle,
          height: 62,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: '#64748B',
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
            <Text style={{ fontSize: 20 }}>{focused ? '📖' : '📑'}</Text>
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
}

