import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useProgressStore, useReviewStore } from '../../src/stores/StoreContext';
import { colors } from '../../src/theme/colors';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { StreakHeatmap } from '../../src/components/StreakHeatmap';
import { DailyQuestCard } from '../../src/components/DailyQuestCard';

export default observer(function TodayScreen() {
  const router = useRouter();
  const progress = useProgressStore();
  const review = useReviewStore();

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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* App Top Header */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.brandTitle}>NIHONGO LOCAL</Text>
            <Text style={styles.levelSubtitle}>Trình độ: {progress.level} • Căn bản</Text>
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
        <Card style={styles.continueCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardBadge}>🎯 BÀI TIẾP THEO</Text>
            <Text style={styles.estTime}>⏱️ ~10 phút</Text>
          </View>
          <Text style={styles.lessonTitle}>{progress.currentLessonTitle}</Text>
          <Text style={styles.lessonDesc}>
            Học cách sử dụng trợ từ を để xác định đối tượng hành động và câu ví dụ đời sống.
          </Text>
          <View style={styles.lessonActions}>
            <Button
              title="▶ Tiếp tục học ngay"
              variant="accent"
              onPress={handleStartLesson}
              style={styles.mainActionBtn}
            />
            <Button
              title="🗣️ Luyện Pitch"
              variant="outline"
              onPress={handleStartPitch}
              style={styles.secondaryActionBtn}
            />
          </View>
        </Card>

        {/* Due Cards SRS Counter */}
        <Card style={styles.srsDueCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardBadge}>📦 CẦN ÔN TẬP HÔM NAY (SRS DUE)</Text>
            <Text style={styles.dueTotal}>{review.cards.length} thẻ đến hạn</Text>
          </View>
          <View style={styles.srsPillsRow}>
            <View style={[styles.srsPill, { borderColor: '#6366F1' }]}>
              <Text style={[styles.srsPillNum, { color: '#818CF8' }]}>1</Text>
              <Text style={styles.srsPillLabel}>Ngữ pháp</Text>
            </View>
            <View style={[styles.srsPill, { borderColor: '#F59E0B' }]}>
              <Text style={[styles.srsPillNum, { color: '#FBBF24' }]}>1</Text>
              <Text style={styles.srsPillLabel}>Kanji</Text>
            </View>
            <View style={[styles.srsPill, { borderColor: '#10B981' }]}>
              <Text style={[styles.srsPillNum, { color: '#34D399' }]}>1</Text>
              <Text style={styles.srsPillLabel}>Từ vựng</Text>
            </View>
          </View>
          <Button
            title="⚡ Bắt đầu phiên ôn tập SRS"
            variant="primary"
            onPress={handleStartReview}
            style={styles.reviewBtn}
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
    backgroundColor: colors.dark.bgCanvas,
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
    color: colors.dark.textPrimary,
    letterSpacing: 0.5,
  },
  levelSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
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
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 18,
    marginVertical: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(244, 63, 94, 0.3)',
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
    color: colors.accent,
    letterSpacing: 0.5,
  },
  estTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.dark.textPrimary,
    marginVertical: 4,
  },
  lessonDesc: {
    fontSize: 13,
    color: '#94A3B8',
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
    backgroundColor: colors.dark.bgSurface,
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
    backgroundColor: colors.dark.bgSubtle,
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
    color: '#94A3B8',
    marginTop: 2,
  },
  reviewBtn: {
    marginTop: 4,
  },
});

