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
import { useSettingsStore } from '../../src/stores/StoreContext';

export default observer(function LearnScreen() {
  const router = useRouter();
  const settings = useSettingsStore();
  const theme = settings?.currentTheme || colors.dark;

  const [selectedLevelId, setSelectedLevelId] = useState<'intro' | 'n5' | 'n4' | 'n3' | 'n2'>('intro');
  const [units, setUnits] = useState<UnitData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Trạng thái Bảng chữ cái (Kana)
  const [kanaType, setKanaType] = useState<'hiragana' | 'katakana'>('hiragana');
  const [selectedRow, setSelectedRow] = useState<string>('all');
  const [activeKana, setActiveKana] = useState<KanaCharacter | null>(null);
  const [isScrollEnabled, setIsScrollEnabled] = useState<boolean>(true);

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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bgCanvas }]}>
      {/* Top Level Selector Chips: Bảng chữ cái (Kana) đứng đầu, ngay cạnh N5 */}
      <View style={[styles.levelSelector, { backgroundColor: theme.bgSurface, borderBottomColor: theme.borderSubtle }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.levelScroll}>
          {SEED_LEVELS.map((lvl) => {
            const isChipActive = selectedLevelId === lvl.id;
            return (
              <TouchableOpacity
                key={lvl.id}
                activeOpacity={0.7}
                onPress={() => {
                  hapticService.light();
                  setSelectedLevelId(lvl.id as any);
                }}
                style={[
                  styles.levelChip,
                  { backgroundColor: theme.bgSubtle },
                  isChipActive && { backgroundColor: theme.accentBg, borderColor: theme.accent },
                ]}
              >
                <Text
                  style={[
                    styles.levelChipText,
                    { color: theme.textSecondary },
                    isChipActive && { color: theme.accent, fontWeight: '800' },
                  ]}
                >
                  {lvl.id === 'intro' ? '🎌 Bảng chữ cái' : lvl.title.split(':')[0]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        scrollEnabled={isScrollEnabled}
        contentContainerStyle={styles.scrollContent}
      >
        {/* TAB 1: BẢNG CHỮ CÁI (KANA) DÀNH CHO NGƯỜI MỚI BẮT ĐẦU */}
        {selectedLevelId === 'intro' ? (
          <View style={styles.kanaDashboard}>
            {/* Banner giới thiệu */}
            <View style={[styles.kanaIntroBanner, { backgroundColor: theme.bgSurface, borderColor: theme.borderSubtle }]}>
              <View style={styles.kanaIntroHeader}>
                <Badge label="DÀNH CHO NGƯỜI MỚI BẮT ĐẦU" variant="purple" />
                <Text style={[styles.kanaCountText, { color: theme.textSecondary }]}>{currentKanaList.length} ký tự</Text>
              </View>
              <Text style={[styles.kanaIntroTitle, { color: theme.textPrimary }]}>🎌 Bảng Chữ Cái Tiếng Nhật</Text>
              <Text style={[styles.kanaIntroDesc, { color: theme.textSecondary }]}>
                Làm quen với mặt chữ, phát âm Romaji và chạm vào bất kỳ chữ nào để mở <Text style={{ color: theme.accent, fontWeight: '700' }}>card luyện viết nét</Text> bằng ngón tay!
              </Text>
            </View>

            {/* Nút Bài kiểm tra Bảng chữ cái (Kana Quiz) */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                hapticService.medium();
                router.push('/quiz/kana-quiz' as any);
              }}
              style={[
                styles.kanaQuizBanner,
                {
                  backgroundColor: theme.mode === 'light' ? theme.accentBg : 'rgba(244, 63, 94, 0.12)',
                  borderColor: theme.mode === 'light' ? theme.accent : 'rgba(244, 63, 94, 0.35)',
                },
              ]}
            >
              <View style={styles.kanaQuizLeft}>
                <Text style={styles.kanaQuizIcon}>🎯</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.kanaQuizTitle, { color: theme.textPrimary }]}>Bài kiểm tra Bảng chữ cái (Kana Test)</Text>
                  <Text style={[styles.kanaQuizSubtitle, { color: theme.textSecondary }]}>10 câu trắc nghiệm nhận diện mặt chữ & Romaji · +30 XP</Text>
                </View>
              </View>
              <View style={[styles.kanaQuizBadge, { backgroundColor: theme.accent }]}>
                <Text style={styles.kanaQuizBadgeText}>Vào thi ➔</Text>
              </View>
            </TouchableOpacity>

            {/* Type Switcher: Hiragana vs Katakana */}
            <View style={styles.kanaTypeSwitch}>
              <TouchableOpacity
                style={[
                  styles.typeTab,
                  { backgroundColor: theme.bgSubtle },
                  kanaType === 'hiragana' && { backgroundColor: theme.accentBg, borderColor: theme.accent, borderWidth: 1.5 },
                ]}
                onPress={() => {
                  hapticService.light();
                  setKanaType('hiragana');
                  setActiveKana(null);
                }}
              >
                <Text style={[styles.typeTabText, { color: theme.textSecondary }, kanaType === 'hiragana' && { color: theme.accent, fontWeight: '800' }]}>
                  Hiragana (Chữ mềm)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeTab,
                  { backgroundColor: theme.bgSubtle },
                  kanaType === 'katakana' && { backgroundColor: theme.accentBg, borderColor: theme.accent, borderWidth: 1.5 },
                ]}
                onPress={() => {
                  hapticService.light();
                  setKanaType('katakana');
                  setActiveKana(null);
                }}
              >
                <Text style={[styles.typeTabText, { color: theme.textSecondary }, kanaType === 'katakana' && { color: theme.accent, fontWeight: '800' }]}>
                  Katakana (Chữ cứng)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Interactive Write Card (Khi người học chạm vào 1 ký tự) */}
            {activeKana && (
              <CharacterWriteCard
                character={activeKana}
                onClose={() => {
                  setIsScrollEnabled(true);
                  setActiveKana(null);
                }}
                onDrawStart={() => setIsScrollEnabled(false)}
                onDrawEnd={() => setIsScrollEnabled(true)}
              />
            )}

            {/* Filter Pills theo Hàng âm */}
            <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>CHỌN HÀNG ÂM CẦN HỌC:</Text>
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
              ].map((row) => {
                const isRowActive = selectedRow === row.id;
                return (
                  <TouchableOpacity
                    key={row.id}
                    onPress={() => {
                      hapticService.light();
                      setSelectedRow(row.id);
                    }}
                    style={[
                      styles.rowPill,
                      { backgroundColor: theme.bgSubtle, borderColor: theme.borderSubtle },
                      isRowActive && { backgroundColor: theme.accentBg, borderColor: theme.accent },
                    ]}
                  >
                    <Text
                      style={[
                        styles.rowPillText,
                        { color: theme.textSecondary },
                        isRowActive && { color: theme.accent, fontWeight: '800' },
                      ]}
                    >
                      {row.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
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
                      { backgroundColor: theme.bgSurface, borderColor: theme.borderSubtle },
                      isSelected && { borderColor: theme.accent, backgroundColor: theme.accentBg },
                    ]}
                  >
                    <Text style={[styles.kanaChar, { color: theme.textPrimary }, isSelected && { color: theme.accent }]}>
                      {item.char}
                    </Text>
                    <Text style={[styles.kanaRomaji, { color: theme.textSecondary }]}>{item.romaji}</Text>
                    <View style={[styles.strokeBadge, { backgroundColor: theme.bgSubtle }]}>
                      <Text style={[styles.kanaStrokes, { color: theme.textTertiary }]}>{item.strokeCount} nét</Text>
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
            <View style={[styles.skipBanner, { backgroundColor: theme.bgSurface, borderColor: theme.borderSubtle }]}>
              <View style={styles.skipInfo}>
                <Text style={[styles.skipTitle, { color: theme.textPrimary }]}>⚡ Đã có nền tảng tiếng Nhật?</Text>
                <Text style={[styles.skipSubtitle, { color: theme.textSecondary }]}>Làm bài test 3 phút để nhảy cóc bài dễ và mở khóa cấp độ cao hơn.</Text>
              </View>
              <TouchableOpacity style={[styles.skipBtn, { backgroundColor: theme.accent }]} onPress={handleSkipLevel}>
                <Text style={styles.skipBtnText}>Mở khóa ➔</Text>
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <ActivityIndicator size="large" color={theme.accent} style={{ marginTop: 40 }} />
            ) : (
              /* Units Roadmap */
              <View style={styles.unitsContainer}>
                {units.map((unit, index) => (
                  <Card key={unit.id} style={[styles.unitCard, { backgroundColor: theme.bgSurface, borderColor: theme.borderSubtle }]}>
                    <View style={styles.unitHeader}>
                      <Badge label={`UNIT ${index + 1}`} variant="primary" />
                      <Text style={[styles.unitStatus, { color: theme.accent }]}>
                        {index === 0 ? '▶ Đang học' : '🔒 Đã mở'}
                      </Text>
                    </View>

                    <Text style={[styles.unitTitle, { color: theme.textPrimary }]}>{unit.title}</Text>
                    <Text style={[styles.unitDescription, { color: theme.textSecondary }]}>{unit.description}</Text>

                    {/* Lessons within this Unit */}
                    <View style={styles.lessonsList}>
                      {unit.lessons.map((lesson, lIdx) => (
                        <TouchableOpacity
                          key={lesson.id}
                          style={[
                            styles.lessonItem,
                            { backgroundColor: theme.bgSubtle },
                            lIdx === 0 && { borderColor: theme.accent, borderWidth: 1 },
                          ]}
                          onPress={() => handleStartLesson(lesson.id)}
                        >
                          <Text
                            style={[
                              styles.lessonIcon,
                              { color: lIdx === 0 ? theme.accent : theme.textTertiary },
                            ]}
                          >
                            {lIdx === 0 ? '▶' : '●'}
                          </Text>
                          <View style={styles.lessonTextWrapper}>
                            <Text
                              style={[
                                styles.lessonItemTitle,
                                { color: theme.textPrimary },
                                lIdx === 0 && { color: theme.accent, fontWeight: '800' },
                              ]}
                            >
                              {lesson.title}
                            </Text>
                            <Text style={[styles.lessonItemMeta, { color: theme.textTertiary }]}>
                              {lesson.type === 'grammar' ? 'Ngữ pháp & Kanji' : 'Ôn tập'} • {lesson.durationMinutes} phút
                            </Text>
                          </View>
                          <Text style={[styles.lessonItemAction, { color: theme.accent }]}>Học ➔</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Nút Bài kiểm tra Unit (Quiz) */}
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handleStartUnitQuiz(unit.id)}
                      style={[
                        styles.unitQuizButton,
                        {
                          backgroundColor: theme.mode === 'light' ? theme.accentBg : 'rgba(244, 63, 94, 0.1)',
                          borderColor: theme.mode === 'light' ? theme.accent : 'rgba(244, 63, 94, 0.3)',
                        },
                      ]}
                    >
                      <View style={styles.unitQuizLeft}>
                        <Text style={styles.unitQuizIcon}>🎯</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.unitQuizTitle, { color: theme.textPrimary }]}>Bài kiểm tra Unit {index + 1}</Text>
                          <Text style={[styles.unitQuizSubtitle, { color: theme.textSecondary }]}>5 câu trắc nghiệm & sắp xếp câu · +50 XP</Text>
                        </View>
                      </View>
                      <View style={[styles.unitQuizBadge, { backgroundColor: theme.accent }]}>
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
  kanaQuizBanner: {
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(244, 63, 94, 0.35)',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kanaQuizLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  kanaQuizIcon: {
    fontSize: 24,
  },
  kanaQuizTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.dark.textPrimary,
  },
  kanaQuizSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  kanaQuizBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  kanaQuizBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
