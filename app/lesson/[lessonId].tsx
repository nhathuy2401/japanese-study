import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { colors } from '../../src/theme/colors';
import { SEED_GRAMMAR_POINTS, SEED_KANJI } from '../../src/db/seed/n5Data';
import { GrammarBlock } from '../../src/components/GrammarBlock';
import { InteractiveSentence } from '../../src/components/InteractiveSentence';
import { KanjiCanvas } from '../../src/components/KanjiCanvas';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { hapticService } from '../../src/services/haptics/hapticService';
import { useProgressStore } from '../../src/stores/StoreContext';
import { curriculumService } from '../../src/services/curriculum/curriculumService';
import { grammarService } from '../../src/services/grammar/grammarService';
import { kanjiService } from '../../src/services/kanji/kanjiService';
import { DomainGrammarPoint, DomainKanji } from '../../src/domain/entities/types';

export default observer(function LessonRunnerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const lessonId = String(params.lessonId || 'lesson-1');
  const progressStore = useProgressStore();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 4;

  const [grammar, setGrammar] = useState<DomainGrammarPoint>(SEED_GRAMMAR_POINTS[0]);
  const [kanji, setKanji] = useState<DomainKanji>(SEED_KANJI[0]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Quiz State for Step 3: Interactive Sentence Builder
  const targetWords = ['わたしは', 'ジュース', 'を', 'のみます'];
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [bankWords, setBankWords] = useState<string[]>([
    'ジュース',
    'のみます',
    'を',
    'わたしは',
    'に',
    'たべます',
  ]);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingData(true);

    const lesson = curriculumService.findLessonById(lessonId);
    if (lesson) {
      Promise.all([
        lesson.grammarPointId ? grammarService.getGrammarPointById(lesson.grammarPointId) : null,
        lesson.kanjiId ? kanjiService.getKanjiById(lesson.kanjiId) : null,
      ]).then(([loadedGrammar, loadedKanji]) => {
        if (isMounted) {
          if (loadedGrammar) setGrammar(loadedGrammar);
          if (loadedKanji) setKanji(loadedKanji);
          setIsLoadingData(false);
        }
      });
    } else {
      setIsLoadingData(false);
    }

    return () => {
      isMounted = false;
    };
  }, [lessonId]);

  const handleWordSelect = (word: string, index: number) => {
    if (isAnswerChecked) return;
    hapticService.light();
    setSelectedWords((prev) => [...prev, word]);
    setBankWords((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRemoveWord = (word: string, index: number) => {
    if (isAnswerChecked) return;
    hapticService.light();
    setSelectedWords((prev) => [...prev, word]);
    setBankWords((prev) => [...prev, word]);
  };

  const handleCheckAnswer = () => {
    const isMatched =
      selectedWords.length === targetWords.length &&
      selectedWords.every((w, i) => w === targetWords[i]);

    setIsAnswerChecked(true);
    setIsCorrect(isMatched);

    if (isMatched) {
      hapticService.success();
    } else {
      hapticService.error();
    }
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      hapticService.light();
    } else {
      progressStore.recordStudyActivity('lesson');
      progressStore.completeQuest('quest-1');
      hapticService.success();
      Alert.alert('Hoàn thành bài học! 🏆', 'Bạn đã hoàn tất bài học và nhận được +20 XP!', [
        { text: 'Về trang chủ', onPress: () => router.back() },
      ]);
    }
  };

  if (isLoadingData) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header & Progress Stepper */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.progressBarWrapper}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${(currentStep / totalSteps) * 100}%` },
            ]}
          />
        </View>

        <Text style={styles.stepText}>
          {currentStep}/{totalSteps}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Step 1: Grammar Concept & Formula */}
        {currentStep === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepBadge}>BƯỚC 1: KIẾN THỨC CỐT LÕI</Text>
            <GrammarBlock grammar={grammar} />
          </View>
        )}

        {/* Step 2: Interactive Sentences & Furigana Inspection */}
        {currentStep === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepBadge}>BƯỚC 2: CÂU VÍ DỤ TƯƠNG TÁC</Text>
            <Text style={styles.stepInstruction}>
              Chạm vào bất kỳ từ vựng nào để xem giải thích, âm Hán Việt và cao độ:
            </Text>
            {grammar.examples.map((ex, idx) => (
              <InteractiveSentence
                key={idx}
                tokens={ex.tokens || []}
                meaningVi={ex.meaningVi}
                romajiSentence={ex.reading}
              />
            ))}
          </View>
        )}

        {/* Step 3: Interactive Sentence Builder Quiz */}
        {currentStep === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepBadge}>BƯỚC 3: BÀI TẬP SẮP XẾP CÂU</Text>
            <Text style={styles.quizPrompt}>
              Dịch câu sau: <Text style={styles.quizPromptBold}>"Tôi uống nước hoa quả."</Text>
            </Text>

            {/* Selected Words Area (Answer Dropzone) */}
            <View style={styles.dropZone}>
              {selectedWords.length === 0 ? (
                <Text style={styles.dropPlaceholder}>
                  Chạm vào các từ bên dưới để đưa lên đây...
                </Text>
              ) : (
                <View style={styles.wordsWrap}>
                  {selectedWords.map((word, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => handleRemoveWord(word, idx)}
                      style={styles.selectedPill}
                    >
                      <Text style={styles.selectedPillText}>{word}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Word Bank */}
            <Text style={styles.bankLabel}>NGÂN HÀNG TỪ VỰNG GỢI Ý:</Text>
            <View style={styles.wordsWrap}>
              {bankWords.map((word, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleWordSelect(word, idx)}
                  style={styles.bankPill}
                >
                  <Text style={styles.bankPillText}>{word}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Check Button & Feedback Sheet */}
            {!isAnswerChecked ? (
              <Button
                title="Kiểm tra đáp án"
                variant="accent"
                disabled={selectedWords.length === 0}
                onPress={handleCheckAnswer}
                style={styles.actionBtn}
              />
            ) : (
              <Card
                style={[
                  styles.feedbackCard,
                  isCorrect ? styles.feedbackCorrect : styles.feedbackWrong,
                ]}
              >
                <Text style={styles.feedbackTitle}>
                  {isCorrect ? '🎉 CHÍNH XÁC!' : '❌ CHƯA ĐÚNG!'}
                </Text>
                <Text style={styles.feedbackDesc}>
                  Đáp án chuẩn: わたしは ジュース を のみます。
                  (Trợ từ を đứng sau danh từ để xác định đối tượng hành động).
                </Text>
              </Card>
            )}
          </View>
        )}

        {/* Step 4: Kanji Anatomy & Lesson Summary */}
        {currentStep === 4 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepBadge}>BƯỚC 4: KANJI & TỔNG KẾT</Text>
            <KanjiCanvas kanji={kanji} />
          </View>
        )}
      </ScrollView>

      {/* Bottom Floating Navigation */}
      <View style={styles.bottomNav}>
        <Button
          title={currentStep === totalSteps ? '🏆 Hoàn thành bài học' : 'Tiếp tục ➔'}
          variant="primary"
          onPress={handleNextStep}
          style={styles.nextBtn}
        />
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.dark.bgCanvas,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.dark.bgSurface,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.borderSubtle,
  },
  closeBtn: {
    padding: 6,
    marginRight: 10,
  },
  closeText: {
    fontSize: 18,
    color: '#94A3B8',
    fontWeight: '700',
  },
  progressBarWrapper: {
    flex: 1,
    height: 8,
    backgroundColor: colors.dark.bgSubtle,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.dark.textPrimary,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  stepContainer: {
    gap: 12,
  },
  stepBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 0.5,
  },
  stepInstruction: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
  },
  quizPrompt: {
    fontSize: 15,
    color: colors.dark.textSecondary,
    marginBottom: 8,
  },
  quizPromptBold: {
    color: colors.dark.textPrimary,
    fontWeight: '800',
  },
  dropZone: {
    backgroundColor: colors.dark.bgSubtle,
    borderRadius: 16,
    padding: 16,
    minHeight: 90,
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.dark.borderSubtle,
  },
  dropPlaceholder: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  wordsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedPill: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  selectedPillText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  bankLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    marginTop: 14,
    marginBottom: 6,
  },
  bankPill: {
    backgroundColor: colors.dark.bgSurface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.dark.borderSubtle,
  },
  bankPillText: {
    color: colors.dark.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  actionBtn: {
    marginTop: 16,
  },
  feedbackCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
  },
  feedbackCorrect: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  feedbackWrong: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.dark.textPrimary,
    marginBottom: 4,
  },
  feedbackDesc: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    lineHeight: 18,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.dark.bgSurface,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.dark.borderSubtle,
  },
  nextBtn: {
    width: '100%',
  },
});
