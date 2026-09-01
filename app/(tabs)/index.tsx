import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useProgressStore, useReviewStore, useAppTheme } from '../../src/stores/StoreContext';
import { colors } from '../../src/theme/colors';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { StreakHeatmap } from '../../src/components/StreakHeatmap';
import { DailyQuestCard } from '../../src/components/DailyQuestCard';

export default observer(function TodayScreen() {
  const router = useRouter();
  const progress = useProgressStore();
  const review = useReviewStore();
  const theme = useAppTheme();

  const handleStartLesson = () => {
    router.push('/lesson/lesson-1' as any);
  };

  const handleStartReview = () => {
    router.push('/(tabs)/review' as any);
  };

  const handleStartPitch = () => {
    router.push('/pitch/item-1' as any);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bgCanvas }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* App Top Header */}
        <View style={styles.topHeader}>
          <View>
            <Text style={[styles.brandTitle, { color: theme.textPrimary }]}>NIHONGO LOCAL</Text>
            <Text style={[styles.levelSubtitle, { color: theme.textSecondary }]}>
              Trình độ: {progress.level} • Căn bản
            </Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {progress.currentStreak}</Text>
            </View>
            <View style={styles.xpBadge}>
              <Text style={styles.xpText}>⭐ {progress.totalXp} XP</Text>
            </View>
          </View>
        </View>

        {/* Continue Learning Active Lesson */}
        <Card
          style={[
            styles.continueCard,
            {
              backgroundColor: theme.bgSurface,
              borderColor: theme.mode === 'light' ? theme.borderSubtle : 'rgba(244, 63, 94, 0.3)',
            },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.cardBadge, { color: theme.accent }]}>🎯 BÀI TIẾP THEO</Text>
            <Text style={[styles.estTime, { color: theme.textSecondary }]}>⏱️ ~10 phút</Text>
          </View>
          <Text style={[styles.lessonTitle, { color: theme.textPrimary }]}>{progress.currentLessonTitle}</Text>
          <Text style={[styles.lessonDesc, { color: theme.textSecondary }]}>
            Học cách sử dụng trợ từ を để xác định đối tượng hành động và câu ví dụ đời sống.
          </Text>
          <View style={styles.lessonActions}>
            <Button
              title="▶ Tiếp tục học ngay"
              variant="accent"
              onPress={handleStartLesson}
              style={[
                styles.mainActionBtn,
                theme.mode === 'light' && { backgroundColor: theme.accent },
              ]}
            />
            <Button
              title="🗣️ Luyện Pitch"
              variant="outline"
              onPress={handleStartPitch}
              style={styles.secondaryActionBtn}
              textStyle={theme.mode === 'light' ? { color: theme.accent } : undefined}
            />
          </View>
        </Card>

        {/* Due Cards SRS Counter */}
        <Card
          style={[
            styles.srsDueCard,
            {
              backgroundColor: theme.bgSurface,
              borderColor: theme.borderSubtle,
            },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.cardBadge, { color: theme.accent }]}>📦 CẦN ÔN TẬP HÔM NAY (SRS DUE)</Text>
            <Text style={[styles.dueTotal, { color: theme.accent }]}>{review.cards.length} thẻ đến hạn</Text>
          </View>
          <View style={styles.srsPillsRow}>
            <View style={[styles.srsPill, { backgroundColor: theme.bgSubtle, borderColor: '#6366F1' }]}>
              <Text style={[styles.srsPillNum, { color: '#6366F1' }]}>1</Text>
              <Text style={[styles.srsPillLabel, { color: theme.textSecondary }]}>Ngữ pháp</Text>
            </View>
            <View style={[styles.srsPill, { backgroundColor: theme.bgSubtle, borderColor: '#F59E0B' }]}>
              <Text style={[styles.srsPillNum, { color: theme.accent }]}>1</Text>
              <Text style={[styles.srsPillLabel, { color: theme.textSecondary }]}>Kanji</Text>
            </View>
            <View style={[styles.srsPill, { backgroundColor: theme.bgSubtle, borderColor: '#10B981' }]}>
              <Text style={[styles.srsPillNum, { color: '#10B981' }]}>1</Text>
              <Text style={[styles.srsPillLabel, { color: theme.textSecondary }]}>Từ vựng</Text>
            </View>
          </View>
          <Button
            title="⚡ Bắt đầu phiên ôn tập SRS"
            variant="primary"
            onPress={handleStartReview}
            style={[
              styles.reviewBtn,
              theme.mode === 'light' && { backgroundColor: theme.accent },
            ]}
          />
        </Card>

        {/* Daily Quests Component */}
        <DailyQuestCard />

        {/* Streak Heatmap Component */}
        <StreakHeatmap />
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  levelSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  streakBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.warning,
  },
  xpBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  xpText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.success,
  },
  continueCard: {
    borderRadius: 20,
    padding: 18,
    marginVertical: 6,
    borderWidth: 1.5,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardBadge: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  estTime: {
    fontSize: 12,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginVertical: 4,
  },
  lessonDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  lessonActions: {
    flexDirection: 'row',
    gap: 10,
  },
  mainActionBtn: {
    flex: 2,
  },
  secondaryActionBtn: {
    flex: 1,
  },
  srsDueCard: {
    borderRadius: 18,
    padding: 16,
    marginVertical: 6,
  },
  dueTotal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.warning,
  },
  srsPillsRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 12,
  },
  srsPill: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  srsPillNum: {
    fontSize: 16,
    fontWeight: '800',
  },
  srsPillLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  reviewBtn: {
    marginTop: 4,
  },
});
