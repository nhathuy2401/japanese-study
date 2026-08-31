import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { colors } from '../../src/theme/colors';
import { SEED_LEVELS, SEED_UNITS } from '../../src/db/seed/n5Data';
import { Card } from '../../src/components/Card';
import { Badge } from '../../src/components/Badge';
import { Button } from '../../src/components/Button';
import { hapticService } from '../../src/services/haptics/hapticService';

export default observer(function LearnScreen() {
  const router = useRouter();
  const [selectedLevelId, setSelectedLevelId] = useState<string>('n5');

  const handleStartLesson = (lessonId: string) => {
    hapticService.light();
    router.push(`/lesson/${lessonId}` as any);
  };

  const handleSkipLevel = () => {
    hapticService.medium();
    alert('Tính năng Mở khóa vượt cấp (Skip Checkpoint): Bạn có thể làm bài kiểm tra 15 câu để mở khóa thẳng N4/N3!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Level Selector Chips */}
      <View style={styles.levelSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.levelScroll}>
          {SEED_LEVELS.map((lvl) => (
            <TouchableOpacity
              key={lvl.id}
              activeOpacity={0.7}
              onPress={() => {
                hapticService.light();
                setSelectedLevelId(lvl.id);
              }}
              style={[
                styles.levelChip,
                selectedLevelId === lvl.id && styles.levelChipActive,
              ]}
            >
              <Text
                style={[
                  styles.levelChipText,
                  selectedLevelId === lvl.id && styles.levelChipTextActive,
                ]}
              >
                {lvl.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Pro Learner Skip Checkpoint Banner */}
        <View style={styles.skipBanner}>
          <View style={styles.skipInfo}>
            <Text style={styles.skipTitle}>⚡ Đã có nền tảng tiếng Nhật?</Text>
            <Text style={styles.skipSubtitle}>Làm bài test 3 phút để nhảy cóc bài dễ và mở khóa cấp độ cao hơn.</Text>
          </View>
          <TouchableOpacity style={styles.skipBtn} onPress={handleSkipLevel}>
            <Text style={styles.skipBtnText}>Mở khóa ➔</Text>
          </TouchableOpacity>
        </View>

        {/* Units Roadmap */}
        <View style={styles.unitsContainer}>
          {SEED_UNITS.map((unit, index) => (
            <Card key={unit.id} style={styles.unitCard}>
              <View style={styles.unitHeader}>
                <Badge label={`UNIT ${index + 1}`} variant="primary" />
                <Text style={styles.unitStatus}>
                  {index === 0 ? '✓ Đã hoàn thành' : index === 1 ? '▶ Đang học' : '🔒 Đã khóa'}
                </Text>
              </View>

              <Text style={styles.unitTitle}>{unit.title}</Text>
              <Text style={styles.unitDescription}>{unit.description}</Text>

              {/* Lessons within this Unit */}
              <View style={styles.lessonsList}>
                <TouchableOpacity
                  style={styles.lessonItem}
                  onPress={() => handleStartLesson('lesson-1')}
                >
                  <Text style={styles.lessonIcon}>●</Text>
                  <View style={styles.lessonTextWrapper}>
                    <Text style={styles.lessonItemTitle}>Bài 1: Trợ từ これ・それ・あれ</Text>
                    <Text style={styles.lessonItemMeta}>Ngữ pháp • 8 phút</Text>
                  </View>
                  <Text style={styles.lessonItemAction}>Học lại</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.lessonItem, styles.lessonItemActive]}
                  onPress={() => handleStartLesson('lesson-2')}
                >
                  <Text style={[styles.lessonIcon, { color: colors.accent }]}>▶</Text>
                  <View style={styles.lessonTextWrapper}>
                    <Text style={[styles.lessonItemTitle, { color: colors.accent }]}>
                      Bài 2: Mẫu câu 〜てはいけません (Cấm đoán)
                    </Text>
                    <Text style={styles.lessonItemMeta}>Ngữ pháp & Kanji • 10 phút</Text>
                  </View>
                  <Badge label="Đang học" variant="danger" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.lessonItem}
                  onPress={() => handleStartLesson('lesson-3')}
                >
                  <Text style={styles.lessonIcon}>○</Text>
                  <View style={styles.lessonTextWrapper}>
                    <Text style={styles.lessonItemTitle}>Bài 3: Kanji 休 (Hưu) & Từ ghép</Text>
                    <Text style={styles.lessonItemMeta}>Kanji • 6 phút</Text>
                  </View>
                  <Text style={styles.lessonItemAction}>Chưa học</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.dark.bgCanvas,
  },
  levelSelector: {
    backgroundColor: colors.dark.bgSurface,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.borderSubtle,
    paddingVertical: 10,
  },
  levelScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  levelChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.dark.bgSubtle,
  },
  levelChipActive: {
    backgroundColor: colors.accent,
  },
  levelChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
  },
  levelChipTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  skipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    marginBottom: 16,
  },
  skipInfo: {
    flex: 1,
    marginRight: 10,
  },
  skipTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#818CF8',
    marginBottom: 2,
  },
  skipSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 15,
  },
  skipBtn: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  skipBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  unitsContainer: {
    gap: 14,
  },
  unitCard: {
    backgroundColor: colors.dark.bgSurface,
    borderRadius: 18,
    padding: 16,
  },
  unitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  unitStatus: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  unitTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.dark.textPrimary,
    marginBottom: 4,
  },
  unitDescription: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 16,
    marginBottom: 14,
  },
  lessonsList: {
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: colors.dark.borderSubtle,
    paddingTop: 12,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.bgSubtle,
    padding: 12,
    borderRadius: 12,
  },
  lessonItemActive: {
    backgroundColor: 'rgba(244, 63, 94, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.25)',
  },
  lessonIcon: {
    fontSize: 14,
    color: '#94A3B8',
    marginRight: 10,
  },
  lessonTextWrapper: {
    flex: 1,
  },
  lessonItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },
  lessonItemMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  lessonItemAction: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
});

