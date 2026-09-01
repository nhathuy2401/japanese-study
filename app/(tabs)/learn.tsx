import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { colors } from '../../src/theme/colors';
import { SEED_LEVELS } from '../../src/db/seed/n5Data';
import { Card } from '../../src/components/Card';
import { Badge } from '../../src/components/Badge';
import { hapticService } from '../../src/services/haptics/hapticService';
import { curriculumService } from '../../src/services/curriculum/curriculumService';
import { UnitData } from '../../src/data/curriculum/curriculumData';

export default observer(function LearnScreen() {
  const router = useRouter();
  const [selectedLevelId, setSelectedLevelId] = useState<'n5' | 'n4' | 'n3' | 'n2'>('n5');
  const [units, setUnits] = useState<UnitData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    curriculumService
      .getUnitsByLevel(selectedLevelId)
      .then((loadedUnits) => {
        if (isMounted) {
          setUnits(loadedUnits);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Lỗi tải units cho level:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedLevelId]);

  const handleStartLesson = (lessonId: string) => {
    hapticService.light();
    router.push(`/lesson/${lessonId}` as any);
  };

  const handleStartUnitQuiz = (unitId: string) => {
    hapticService.medium();
    router.push(`/quiz/${unitId}` as any);
  };

  const handleSkipLevel = () => {
    hapticService.medium();
    alert('Tính năng Mở khóa vượt cấp (Skip Checkpoint): Bạn có thể làm bài kiểm tra 15 câu để mở khóa thẳng N4/N3/N2!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Level Selector Chips */}
      <View style={styles.levelSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.levelScroll}>
          {SEED_LEVELS.filter((lvl) => ['n5', 'n4', 'n3', 'n2'].includes(lvl.id)).map((lvl) => (
            <TouchableOpacity
              key={lvl.id}
              activeOpacity={0.7}
              onPress={() => {
                hapticService.light();
                setSelectedLevelId(lvl.id as any);
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

        {isLoading ? (
          <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 40 }} />
        ) : (
          /* Units Roadmap */
          <View style={styles.unitsContainer}>
            {units.map((unit, index) => (
              <Card key={unit.id} style={styles.unitCard}>
                <View style={styles.unitHeader}>
                  <Badge label={`UNIT ${index + 1}`} variant="primary" />
                  <Text style={styles.unitStatus}>
                    {index === 0 ? '▶ Đang học' : '🔒 Đã mở'}
                  </Text>
                </View>

                <Text style={styles.unitTitle}>{unit.title}</Text>
                <Text style={styles.unitDescription}>{unit.description}</Text>

                {/* Lessons within this Unit */}
                <View style={styles.lessonsList}>
                  {unit.lessons.map((lesson, lIdx) => (
                    <TouchableOpacity
                      key={lesson.id}
                      style={[
                        styles.lessonItem,
                        lIdx === 0 && styles.lessonItemActive,
                      ]}
                      onPress={() => handleStartLesson(lesson.id)}
                    >
                      <Text
                        style={[
                          styles.lessonIcon,
                          lIdx === 0 && { color: colors.accent },
                        ]}
                      >
                        {lIdx === 0 ? '▶' : '●'}
                      </Text>
                      <View style={styles.lessonTextWrapper}>
                        <Text
                          style={[
                            styles.lessonItemTitle,
                            lIdx === 0 && { color: colors.accent },
                          ]}
                        >
                          {lesson.title}
                        </Text>
                        <Text style={styles.lessonItemMeta}>
                          {lesson.type === 'grammar' ? 'Ngữ pháp & Kanji' : 'Ôn tập'} • {lesson.durationMinutes} phút
                        </Text>
                      </View>
                      <Text style={styles.lessonItemAction}>Học ➔</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Nút Bài kiểm tra Unit (Quiz) */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleStartUnitQuiz(unit.id)}
                  style={styles.unitQuizButton}
                >
                  <View style={styles.unitQuizLeft}>
                    <Text style={styles.unitQuizIcon}>🎯</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.unitQuizTitle}>Bài kiểm tra Unit {index + 1}</Text>
                      <Text style={styles.unitQuizSubtitle}>5 câu trắc nghiệm & sắp xếp câu · +50 XP</Text>
                    </View>
                  </View>
                  <View style={styles.unitQuizBadge}>
                    <Text style={styles.unitQuizBadgeText}>Vào thi ➔</Text>
                  </View>
                </TouchableOpacity>
              </Card>
            ))}
          </View>
        )}
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
  unitQuizButton: {
    marginTop: 14,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(99, 102, 241, 0.35)',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unitQuizLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  unitQuizIcon: {
    fontSize: 22,
  },
  unitQuizTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.dark.textPrimary,
  },
  unitQuizSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  unitQuizBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  unitQuizBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
