import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useProgressStore } from '../stores/StoreContext';
import { colors } from '../theme/colors';

export const StreakHeatmap: React.FC = observer(() => {
  const progress = useProgressStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>CHUỖI HỌC (STREAK)</Text>
        <Text style={styles.streakCount}>🔥 {progress.currentStreak} ngày liên tiếp</Text>
      </View>

      <View style={styles.daysRow}>
        {progress.weeklyActivity.map((item, idx) => (
          <View key={idx} style={styles.daySlot}>
            <View
              style={[
                styles.square,
                item.studied ? styles.squareStudied : styles.squareEmpty,
                idx === 6 && styles.squareToday,
              ]}
            />
            <Text style={[styles.dayLabel, idx === 6 && styles.dayTodayLabel]}>
              {item.day}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark.bgSurface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.dark.borderSubtle,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  streakCount: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.warning,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  daySlot: {
    alignItems: 'center',
  },
  square: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginBottom: 6,
  },
  squareStudied: {
    backgroundColor: colors.success,
  },
  squareEmpty: {
    backgroundColor: colors.dark.bgSubtle,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  squareToday: {
    borderWidth: 2,
    borderColor: colors.accent,
  },
  dayLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  dayTodayLabel: {
    color: colors.dark.textPrimary,
    fontWeight: '700',
  },
});

