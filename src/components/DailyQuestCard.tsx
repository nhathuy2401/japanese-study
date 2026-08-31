import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useProgressStore } from '../stores/StoreContext';
import { colors } from '../theme/colors';

export const DailyQuestCard: React.FC = observer(() => {
  const progress = useProgressStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>NHIỆM VỤ HÔM NAY (DAILY QUESTS)</Text>
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
            style={[styles.questRow, quest.isCompleted && styles.questCompletedRow]}
          >
            <View style={styles.checkCircle}>
              <Text style={styles.checkIcon}>{quest.isCompleted ? '✓' : '○'}</Text>
            </View>
            <View style={styles.questInfo}>
              <Text style={[styles.questTitle, quest.isCompleted && styles.questTitleDone]}>
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
    backgroundColor: colors.dark.bgSubtle,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
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
    color: colors.dark.textPrimary,
  },
  questTitleDone: {
    color: '#64748B',
    textDecorationLine: 'line-through',
  },
  xpBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  xpText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.warning,
  },
});
