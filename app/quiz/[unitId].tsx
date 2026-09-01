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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { colors } from '../../src/theme/colors';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { Badge } from '../../src/components/Badge';
import { FuriganaText } from '../../src/components/FuriganaText';
import { hapticService } from '../../src/services/haptics/hapticService';
import { curriculumService } from '../../src/services/curriculum/curriculumService';
import { quizService, QuizQuestion, QuizResult } from '../../src/services/quiz/quizService';

export default observer(function UnitQuizScreen() {
  const { unitId } = useLocalSearchParams<{ unitId: string }>();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  // Dành riêng cho dạng sắp xếp câu
  const [selectedScrambleWords, setSelectedScrambleWords] = useState<string[]>([]);
  const [scrambleBank, setScrambleBank] = useState<string[]>([]);

  // Trạng thái chấm câu hiện tại
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCurrentCorrect, setIsCurrentCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  // Kết quả tổng kết
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const unit = curriculumService.getUnitById(unitId || '');

  useEffect(() => {
    if (!unitId) return;

    let isMounted = true;
    setIsLoading(true);

    quizService
      .generateUnitQuiz(unitId)
      .then((generated) => {
        if (isMounted) {
          setQuestions(generated);
          if (generated.length > 0 && generated[0].type === 'sentence-scramble') {
            setScrambleBank(generated[0].scrambledWords || []);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Lỗi sinh câu hỏi Quiz:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [unitId]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optId: string) => {
    if (isAnswerChecked) return;
    hapticService.light();
    setSelectedOptionId(optId);
  };

  const handleSelectScrambleWord = (word: string, index: number) => {
    if (isAnswerChecked) return;
    hapticService.light();
    setSelectedScrambleWords((prev) => [...prev, word]);
    setScrambleBank((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveScrambleWord = (word: string, index: number) => {
    if (isAnswerChecked) return;
    hapticService.light();
    setSelectedScrambleWords((prev) => prev.filter((_, i) => i !== index));
    setScrambleBank((prev) => [...prev, word]);
  };

  const handleCheckAnswer = () => {
    if (!currentQ) return;

    let correct = false;
    if (currentQ.type === 'sentence-scramble') {
      const userOrder = selectedScrambleWords.join(' ').trim();
      const targetOrder = (currentQ.correctWordOrder || []).join(' ').trim();
      correct = userOrder === targetOrder;
    } else {
      const selected = currentQ.options.find((o) => o.id === selectedOptionId);
      correct = !!selected?.isCorrect;
    }

    if (correct) {
      hapticService.success();
      setCorrectCount((prev) => prev + 1);
    } else {
      hapticService.error();
    }

    setIsCurrentCorrect(correct);
    setIsAnswerChecked(true);
  };

  const handleNextQuestion = async () => {
    hapticService.light();

    if (currentIndex + 1 < questions.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedOptionId(null);
      setIsAnswerChecked(false);
      setIsCurrentCorrect(false);

      if (questions[nextIdx].type === 'sentence-scramble') {
        setSelectedScrambleWords([]);
        setScrambleBank(questions[nextIdx].scrambledWords || []);
      }
    } else {
      // Đã hoàn thành toàn bộ câu hỏi
      setIsLoading(true);
      const finalResult = await quizService.submitQuizResult(
        unitId || '',
        questions.length,
        correctCount + (isCurrentCorrect ? 1 : 0)
      );
      setQuizResult(finalResult);
      setIsLoading(false);
    }
  };

  const handleRestartQuiz = () => {
    hapticService.medium();
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswerChecked(false);
    setIsCurrentCorrect(false);
    setCorrectCount(0);
    setQuizResult(null);

    if (questions.length > 0 && questions[0].type === 'sentence-scramble') {
      setSelectedScrambleWords([]);
      setScrambleBank(questions[0].scrambledWords || []);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Đang chuẩn bị đề thi Unit...</Text>
      </SafeAreaView>
    );
  }

  // Màn hình Kết quả (Summary Screen)
  if (quizResult) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.resultContainer}>
          <Card style={styles.resultCard} variant="elevated">
            <Text style={styles.resultEmoji}>{quizResult.isPassed ? '🏆' : '💪'}</Text>
            <Text style={styles.resultTitle}>
              {quizResult.isPassed ? 'XUẤT SẮC - ĐÃ ĐẠT!' : 'CẦN CỐ GẮNG THÊM!'}
            </Text>
            <Text style={styles.resultSubtitle}>
              {quizResult.isPassed
                ? 'Bạn đã hoàn thành xuất sắc bài kiểm tra Unit này!'
                : 'Hãy xem lại các cấu trúc trong bài và thử sức lại nhé.'}
            </Text>

            <View style={styles.scoreCircle}>
              <Text style={styles.scoreText}>
                {quizResult.correctCount} / {quizResult.totalQuestions}
              </Text>
              <Text style={styles.percentageText}>{quizResult.scorePercentage}%</Text>
            </View>

            <View style={styles.xpBadge}>
              <Text style={styles.xpBadgeText}>+{quizResult.xpEarned} XP · Chuỗi ngày học đã cập nhật! 🔥</Text>
            </View>

            <View style={styles.resultActions}>
              <Button
                title="Làm lại bài kiểm tra"
                variant="outline"
                onPress={handleRestartQuiz}
                style={styles.actionButton}
              />
              <Button
                title="Hoàn thành & Quay về"
                variant="primary"
                onPress={() => router.back()}
                style={styles.actionButton}
              />
            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!currentQ) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.loadingText}>Không tìm thấy câu hỏi cho Unit này.</Text>
        <Button title="Quay lại" onPress={() => router.back()} style={{ marginTop: 16 }} />
      </SafeAreaView>
    );
  }

  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Navigation & Progress */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.unitBadgeText} numberOfLines={1}>
            {unit?.title || 'Bài kiểm tra Unit'}
          </Text>
          <Text style={styles.questionCounter}>
            Câu {currentIndex + 1} / {questions.length}
          </Text>
        </View>
        <View style={styles.streakIndicator}>
          <Text style={styles.streakText}>Đúng: {correctCount}</Text>
        </View>
      </View>

      {/* Animated Progress Bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Question Card */}
        <Card style={styles.questionCard} variant="elevated">
          <Badge
            label={
              currentQ.type === 'multiple-choice'
                ? 'TRẮC NGHIỆM NGỮ PHÁP'
                : currentQ.type === 'fill-in-blank'
                ? 'ĐIỀN KHUYẾT TRỢ TỪ'
                : currentQ.type === 'furigana-reading'
                ? 'ĐỌC HIỂU KANJI'
                : 'SẮP XẾP CÂU'
            }
            variant="purple"
            style={{ marginBottom: 12 }}
          />

          <Text style={styles.promptText}>{currentQ.prompt}</Text>

          {/* SubPrompt or Target Pattern */}
          {currentQ.subPrompt && (
            <View style={styles.subPromptBox}>
              <Text style={styles.subPromptText}>{currentQ.subPrompt}</Text>
            </View>
          )}

          {/* Japanese Sentence Display with Furigana (if any) */}
          {currentQ.japaneseText && (
            <View style={styles.japaneseBox}>
              <FuriganaText
                text={currentQ.japaneseText}
                fontSize={22}
                furiganaFontSize={12}
                style={{ justifyContent: 'center', marginVertical: 8 }}
              />
            </View>
          )}

          {/* Type: Sentence Scramble */}
          {currentQ.type === 'sentence-scramble' && (
            <View style={styles.scrambleSection}>
              {/* Dropzone */}
              <View style={styles.dropZone}>
                {selectedScrambleWords.length === 0 ? (
                  <Text style={styles.dropPlaceholder}>
                    Chạm các từ phía dưới để xếp thành câu...
                  </Text>
                ) : (
                  <View style={styles.wordsWrap}>
                    {selectedScrambleWords.map((w, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => handleRemoveScrambleWord(w, idx)}
                        style={styles.selectedWordPill}
                      >
                        <Text style={styles.selectedWordText}>{w}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Word Bank */}
              <Text style={styles.bankTitle}>CÁC TỪ GỢI Ý:</Text>
              <View style={styles.wordsWrap}>
                {scrambleBank.map((w, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => handleSelectScrambleWord(w, idx)}
                    style={styles.bankWordPill}
                  >
                    <Text style={styles.bankWordText}>{w}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Type: Multiple Choice & Reading Options */}
          {currentQ.type !== 'sentence-scramble' && (
            <View style={styles.optionsList}>
              {currentQ.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let optionStyle = styles.optionItem;
                if (isSelected) optionStyle = [styles.optionItem, styles.optionItemSelected];
                if (isAnswerChecked) {
                  if (opt.isCorrect) {
                    optionStyle = [styles.optionItem, styles.optionItemCorrect];
                  } else if (isSelected && !opt.isCorrect) {
                    optionStyle = [styles.optionItem, styles.optionItemWrong];
                  }
                }

                return (
                  <TouchableOpacity
                    key={opt.id}
                    activeOpacity={0.7}
                    onPress={() => handleSelectOption(opt.id)}
                    style={optionStyle}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                        isAnswerChecked && opt.isCorrect && styles.optionTextCorrect,
                      ]}
                    >
                      {opt.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </Card>

        {/* Feedback Sheet after Check */}
        {isAnswerChecked && (
          <Card
            style={[
              styles.feedbackCard,
              isCurrentCorrect ? styles.feedbackCardCorrect : styles.feedbackCardWrong,
            ]}
          >
            <Text style={styles.feedbackTitle}>
              {isCurrentCorrect ? '🎉 CHÍNH XÁC!' : '❌ CHƯA CHÍNH XÁC!'}
            </Text>
            <Text style={styles.feedbackExplanation}>{currentQ.explanation}</Text>
          </Card>
        )}
      </ScrollView>

      {/* Bottom Floating Action Bar */}
      <View style={styles.bottomBar}>
        {!isAnswerChecked ? (
          <Button
            title="Kiểm tra đáp án"
            variant="accent"
            size="lg"
            disabled={
              currentQ.type === 'sentence-scramble'
                ? selectedScrambleWords.length === 0
                : !selectedOptionId
            }
            onPress={handleCheckAnswer}
          />
        ) : (
          <Button
            title={currentIndex + 1 < questions.length ? 'Câu tiếp theo ➔' : 'Xem kết quả 🏆'}
            variant="primary"
            size="lg"
            onPress={handleNextQuestion}
          />
        )}
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.dark.bgApp,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.dark.bgApp,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    color: colors.dark.textSecondary,
    fontSize: 16,
    marginTop: 14,
    fontWeight: '600',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  closeBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.dark.bgSubtle,
  },
  closeBtnText: {
    color: colors.dark.textSecondary,
    fontSize: 16,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 12,
    alignItems: 'center',
  },
  unitBadgeText: {
    color: colors.dark.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  questionCounter: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  streakIndicator: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  streakText: {
    color: '#818CF8',
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  questionCard: {
    padding: 20,
    borderRadius: 18,
    backgroundColor: colors.dark.bgSurface,
    borderWidth: 1,
    borderColor: colors.dark.borderSubtle,
  },
  promptText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    lineHeight: 26,
  },
  subPromptBox: {
    backgroundColor: colors.dark.bgSubtle,
    padding: 12,
    borderRadius: 10,
    marginVertical: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  subPromptText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '700',
  },
  japaneseBox: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 16,
    borderRadius: 12,
    marginVertical: 12,
    alignItems: 'center',
  },
  optionsList: {
    marginTop: 16,
    gap: 10,
  },
  optionItem: {
    backgroundColor: colors.dark.bgSubtle,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.dark.borderSubtle,
  },
  optionItemSelected: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(244, 63, 94, 0.08)',
  },
  optionItemCorrect: {
    borderColor: colors.success,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  optionItemWrong: {
    borderColor: colors.danger,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
  },
  optionText: {
    fontSize: 15,
    color: colors.dark.textPrimary,
    lineHeight: 22,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: colors.accent,
    fontWeight: '700',
  },
  optionTextCorrect: {
    color: colors.success,
    fontWeight: '700',
  },
  scrambleSection: {
    marginTop: 16,
  },
  dropZone: {
    minHeight: 64,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropPlaceholder: {
    color: '#64748B',
    fontSize: 13,
    fontStyle: 'italic',
  },
  wordsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  selectedWordPill: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  selectedWordText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  bankTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 8,
  },
  bankWordPill: {
    backgroundColor: colors.dark.bgSubtle,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  bankWordText: {
    color: colors.dark.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  feedbackCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
  },
  feedbackCardCorrect: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: colors.success,
  },
  feedbackCardWrong: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: colors.danger,
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.dark.textPrimary,
    marginBottom: 6,
  },
  feedbackExplanation: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.dark.bgSurface,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.dark.borderSubtle,
  },
  resultContainer: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  resultCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 24,
  },
  resultEmoji: {
    fontSize: 54,
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.dark.textPrimary,
    textAlign: 'center',
  },
  resultSubtitle: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  scoreCircle: {
    marginVertical: 20,
    alignItems: 'center',
    backgroundColor: colors.dark.bgSubtle,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  scoreText: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.accent,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark.textSecondary,
    marginTop: 2,
  },
  xpBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 24,
  },
  xpBadgeText: {
    color: '#F59E0B',
    fontWeight: '700',
    fontSize: 13,
  },
  resultActions: {
    width: '100%',
    gap: 12,
  },
  actionButton: {
    width: '100%',
  },
});

