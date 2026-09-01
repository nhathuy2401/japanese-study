import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useProgressStore, useAppTheme } from '../stores/StoreContext';
import { colors } from '../theme/colors';

export const StreakHeatmap: React.FC = observer(() => {
  const progress = useProgressStore();
  const theme = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.bgSurface, borderColor: theme.borderSubtle }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textSecondary }]}>CHUỖI HỌC (STREAK)</Text>
        <Text style={styles.streakCount}>🔥 {progress.currentStreak} ngày liên tiếp</Text>
      </View>

      <View style={styles.daysRow}>
        {progress.weeklyActivity.map((item, idx) => (
          <View key={idx} style={styles.daySlot}>
            <View
              style={[
                styles.square,
                item.studied ? styles.squareStudied : [styles.squareEmpty, { backgroundColor: theme.bgSubtle, borderColor: theme.borderSubtle }],
                idx === 6 && [styles.squareToday, { borderColor: theme.accent }],
              ]}
            />
            <Text style={[styles.dayLabel, { color: theme.textTertiary }, idx === 6 && [styles.dayTodayLabel, { color: theme.accent }]]}>
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
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
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
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
  },
  squareStudied: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },
  squareEmpty: {
    borderWidth: 1,
  },
  squareToday: {
    borderWidth: 2,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
  },
  dayTodayLabel: {
    fontWeight: '800',
  },
});
