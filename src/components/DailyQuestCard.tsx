import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useProgressStore, useAppTheme } from '../stores/StoreContext';
import { colors } from '../theme/colors';

export const DailyQuestCard: React.FC = observer(() => {
  const progress = useProgressStore();
  const theme = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.bgSurface, borderColor: theme.borderSubtle }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textSecondary }]}>NHIỆM VỤ HÔM NAY (DAILY QUESTS)</Text>
        <Text style={styles.progressCounter}>
          {progress.completedQuestsCount}/{progress.dailyQuests.length} Hoàn thành
        </Text>
      </View>

      <View style={styles.questsList}>
        {progress.dailyQuests.map((quest) => (
          <TouchableOpacity
            key={quest.id}
            activeOpacity={0.7}
            onPress={() => progress.completeQuest(quest.id)}
            style={[
              styles.questRow,
              { backgroundColor: theme.bgSubtle, borderColor: theme.borderSubtle },
              quest.isCompleted && styles.questCompletedRow,
            ]}
          >
            <View style={styles.checkCircle}>
              <Text style={styles.checkIcon}>{quest.isCompleted ? '✓' : '○'}</Text>
            </View>
            <View style={styles.questInfo}>
              <Text
                style={[
                  styles.questTitle,
                  { color: theme.textPrimary },
                  quest.isCompleted && styles.questTitleDone,
                ]}
              >
                {quest.title}
              </Text>
            </View>
            <View style={styles.xpBadge}>
              <Text style={styles.xpText}>+{quest.xpReward} XP</Text>
            </View>
          </TouchableOpacity>
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
  progressCounter: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.success,
  },
  questsList: {
    gap: 8,
  },
  questRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  questCompletedRow: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkIcon: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.success,
  },
  questInfo: {
    flex: 1,
  },
  questTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  questTitleDone: {
    color: '#64748B',
    textDecorationLine: 'line-through',
  },
  xpBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  xpText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.warning,
  },
});
