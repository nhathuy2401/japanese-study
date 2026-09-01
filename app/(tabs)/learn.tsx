import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
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
import {
  HIRAGANA_CHARACTERS,
  KATAKANA_CHARACTERS,
  KanaCharacter,
} from '../../src/data/kana/kanaData';
import { CharacterWriteCard } from '../../src/components/CharacterWriteCard';

export default observer(function LearnScreen() {
  const router = useRouter();
  const [selectedLevelId, setSelectedLevelId] = useState<'intro' | 'n5' | 'n4' | 'n3' | 'n2'>('intro');
  const [units, setUnits] = useState<UnitData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Trạng thái Bảng chữ cái (Kana)
  const [kanaType, setKanaType] = useState<'hiragana' | 'katakana'>('hiragana');
  const [selectedRow, setSelectedRow] = useState<string>('all');
  const [activeKana, setActiveKana] = useState<KanaCharacter | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (selectedLevelId === 'intro') {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    curriculumService
      .getUnitsByLevel(selectedLevelId as any)
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

  const currentKanaList = kanaType === 'hiragana' ? HIRAGANA_CHARACTERS : KATAKANA_CHARACTERS;
  const displayedKana = selectedRow === 'all'
    ? currentKanaList
    : currentKanaList.filter((k) => k.row === selectedRow);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Level Selector Chips: Bảng chữ cái (Kana) đứng đầu, ngay cạnh N5 */}
      <View style={styles.levelSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.levelScroll}>
          {SEED_LEVELS.map((lvl) => (
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
                {lvl.id === 'intro' ? '🎌 Bảng chữ cái' : lvl.title.split(':')[0]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* TAB 1: BẢNG CHỮ CÁI (KANA) DÀNH CHO NGƯỜI MỚI BẮT ĐẦU */}
        {selectedLevelId === 'intro' ? (
          <View style={styles.kanaDashboard}>
            {/* Banner giới thiệu */}
            <View style={styles.kanaIntroBanner}>
              <View style={styles.kanaIntroHeader}>
                <Badge label="DÀNH CHO NGƯỜI MỚI BẮT ĐẦU" variant="purple" />
                <Text style={styles.kanaCountText}>{currentKanaList.length} ký tự</Text>
              </View>
              <Text style={styles.kanaIntroTitle}>🎌 Bảng Chữ Cái Tiếng Nhật</Text>
              <Text style={styles.kanaIntroDesc}>
                Làm quen với mặt chữ, phát âm Romaji và chạm vào bất kỳ chữ nào để mở <Text style={{ color: colors.accent, fontWeight: '700' }}>card luyện viết nét</Text> bằng ngón tay!
              </Text>
            </View>

            {/* Type Switcher: Hiragana vs Katakana */}
            <View style={styles.kanaTypeSwitch}>
              <TouchableOpacity
                style={[styles.typeTab, kanaType === 'hiragana' && styles.typeTabActive]}
                onPress={() => {
                  hapticService.light();
                  setKanaType('hiragana');
                  setActiveKana(null);
                }}
              >
                <Text style={[styles.typeTabText, kanaType === 'hiragana' && styles.typeTabTextActive]}>
                  Hiragana (Chữ mềm)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.typeTab, kanaType === 'katakana' && styles.typeTabActive]}
                onPress={() => {
                  hapticService.light();
                  setKanaType('katakana');
                  setActiveKana(null);
                }}
              >
                <Text style={[styles.typeTabText, kanaType === 'katakana' && styles.typeTabTextActive]}>
                  Katakana (Chữ cứng)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Interactive Write Card (Khi người học chạm vào 1 ký tự) */}
            {activeKana && (
              <CharacterWriteCard
                character={activeKana}
                onClose={() => setActiveKana(null)}
              />
            )}

            {/* Filter Pills theo Hàng âm */}
            <Text style={styles.sectionHeading}>CHỌN HÀNG ÂM CẦN HỌC:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rowPillsScroll}
            >
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'a', label: 'Hàng A (a, i, u, e, o)' },
                { id: 'ka', label: 'Hàng Ka' },
                { id: 'sa', label: 'Hàng Sa' },
                { id: 'ta', label: 'Hàng Ta' },
                { id: 'na', label: 'Hàng Na' },
                { id: 'ha', label: 'Hàng Ha' },
                { id: 'ma', label: 'Hàng Ma' },
                { id: 'ya', label: 'Hàng Ya' },
                { id: 'ra', label: 'Hàng Ra' },
                { id: 'wa', label: 'Hàng Wa & N' },
              ].map((row) => (
                <TouchableOpacity
                  key={row.id}
                  onPress={() => {
                    hapticService.light();
                    setSelectedRow(row.id);
                  }}
                  style={[
                    styles.rowPill,
                    selectedRow === row.id && styles.rowPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.rowPillText,
                      selectedRow === row.id && styles.rowPillTextActive,
                    ]}
                  >
                    {row.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Lưới các thẻ chữ Kana (5 cột chuẩn) */}
            <View style={styles.kanaGrid}>
              {displayedKana.map((item) => {
                const isSelected = activeKana?.id === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.7}
                    onPress={() => {
                      hapticService.medium();
                      setActiveKana(item);
                    }}
                    style={[
                      styles.kanaCard,
                      isSelected && styles.kanaCardSelected,
                    ]}
                  >
                    <Text style={[styles.kanaChar, isSelected && { color: colors.accent }]}>
                      {item.char}
                    </Text>
                    <Text style={styles.kanaRomaji}>{item.romaji}</Text>
                    <View style={styles.strokeBadge}>
                      <Text style={styles.kanaStrokes}>{item.strokeCount} nét</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
          /* TAB JLPT N5 - N2: UNITS ROADMAP */
          <View>
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
    borderRadius: 20,
    backgroundColor: colors.dark.bgSubtle,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  levelChipActive: {
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderColor: colors.accent,
  },
  levelChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.dark.textSecondary,
  },
  levelChipTextActive: {
    color: colors.accent,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  skipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  skipInfo: {
    flex: 1,
    marginRight: 10,
  },
  skipTitle: {
    color: '#818CF8',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  skipSubtitle: {
    color: colors.dark.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  skipBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  skipBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  unitsContainer: {
    gap: 16,
  },
  unitCard: {
    padding: 18,
    borderRadius: 18,
  },
  unitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  unitStatus: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  unitTitle: {
    fontSize: 17,
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

  // STYLES CHO BẢNG CHỮ CÁI (KANA DASHBOARD)
  kanaDashboard: {
    gap: 14,
  },
  kanaIntroBanner: {
    backgroundColor: colors.dark.bgSurface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.dark.borderSubtle,
  },
  kanaIntroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  kanaCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  kanaIntroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.dark.textPrimary,
    marginBottom: 6,
  },
  kanaIntroDesc: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    lineHeight: 19,
  },
  kanaTypeSwitch: {
    flexDirection: 'row',
    backgroundColor: colors.dark.bgSubtle,
    borderRadius: 14,
    padding: 4,
  },
  typeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  typeTabActive: {
    backgroundColor: colors.dark.bgSurface,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  typeTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.dark.textSecondary,
  },
  typeTabTextActive: {
    color: colors.accent,
    fontWeight: '800',
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  rowPillsScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  rowPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.dark.bgSubtle,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  rowPillActive: {
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    borderColor: colors.accent,
  },
  rowPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dark.textSecondary,
  },
  rowPillTextActive: {
    color: colors.accent,
    fontWeight: '700',
  },
  kanaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6,
  },
  kanaCard: {
    width: '18%',
    aspectRatio: 0.85,
    backgroundColor: colors.dark.bgSurface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.dark.borderSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  kanaCardSelected: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(244, 63, 94, 0.08)',
  },
  kanaChar: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.dark.textPrimary,
  },
  kanaRomaji: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 2,
  },
  strokeBadge: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    marginTop: 3,
  },
  kanaStrokes: {
    fontSize: 8,
    fontWeight: '700',
    color: '#64748B',
  },
});
