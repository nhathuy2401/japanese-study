import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { observer } from 'mobx-react-lite';
import { Badge } from '../../src/components/Badge';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { JlptLevel } from '../../src/services/vocabulary/jlptVocabApi';
import { useVocabularyStore } from '../../src/stores/StoreContext';
import { colors } from '../../src/theme/colors';

const JLPT_LEVELS: JlptLevel[] = [5, 4, 3, 2, 1];

export default observer(function VocabularyScreen() {
  const vocabularyStore = useVocabularyStore();

  useEffect(() => {
    void vocabularyStore.initialize();
  }, [vocabularyStore]);

  const handleSearch = () => {
    Keyboard.dismiss();
    void vocabularyStore.search();
  };

  const renderContent = () => {
    if (vocabularyStore.isLoading) {
      return (
        <Card style={styles.stateCard}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.stateTitle}>Đang chuẩn bị bộ từ N{vocabularyStore.selectedLevel}</Text>
          <Text style={styles.stateDescription}>Dữ liệu đang được tải từ JLPT Vocabulary API.</Text>
        </Card>
      );
    }

    if (vocabularyStore.errorMessage) {
      return (
        <Card style={styles.stateCard}>
          <Text style={styles.stateEmoji}>📡</Text>
          <Text style={styles.stateTitle}>Chưa tải được từ vựng</Text>
          <Text style={styles.stateDescription}>{vocabularyStore.errorMessage}</Text>
          <Button title="Thử lại" onPress={() => void vocabularyStore.retry()} style={styles.stateButton} />
        </Card>
      );
    }

    if (vocabularyStore.isSessionFinished) {
      return (
        <Card style={styles.stateCard}>
          <Text style={styles.stateEmoji}>🎉</Text>
          <Text style={styles.stateTitle}>Hoàn thành bộ từ!</Text>
          <Text style={styles.stateDescription}>
            Bạn đã trả lời {vocabularyStore.studiedCount} lượt · nhớ {vocabularyStore.knownCount} từ.
          </Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.danger }]}>{vocabularyStore.againCount}</Text>
              <Text style={styles.summaryLabel}>Quên</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.warning }]}>{vocabularyStore.hardCount}</Text>
              <Text style={styles.summaryLabel}>Khó</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.success }]}>{vocabularyStore.knownCount}</Text>
              <Text style={styles.summaryLabel}>Đã nhớ</Text>
            </View>
          </View>
          <Button
            title={vocabularyStore.activeQuery ? 'Học lại kết quả này' : 'Học bộ 20 từ tiếp theo'}
            onPress={() => void vocabularyStore.loadNextDeck()}
            style={styles.stateButton}
          />
        </Card>
      );
    }

    const word = vocabularyStore.currentWord;
    if (!word) {
      return (
        <Card style={styles.stateCard}>
          <Text style={styles.stateEmoji}>🔎</Text>
          <Text style={styles.stateTitle}>Không tìm thấy từ phù hợp</Text>
          <Text style={styles.stateDescription}>
            Thử nhập từ tiếng Nhật khác hoặc xóa tìm kiếm để trở lại bộ từ N{vocabularyStore.selectedLevel}.
          </Text>
          {vocabularyStore.activeQuery ? (
            <Button title="Xóa tìm kiếm" onPress={() => void vocabularyStore.clearSearch()} style={styles.stateButton} />
          ) : null}
        </Card>
      );
    }

    return (
      <Card style={styles.flashcard} variant="elevated">
        <View style={styles.cardHeader}>
          <Badge label={`JLPT N${word.level}`} variant="purple" />
          <Text style={styles.progressText}>
            Vòng {vocabularyStore.round} · {vocabularyStore.progressLabel}
          </Text>
        </View>

        <View style={styles.wordArea}>
          <Text style={styles.word}>{word.word}</Text>
          {!vocabularyStore.isAnswerVisible ? (
            <Text style={styles.prompt}>Bạn còn nhớ cách đọc và ý nghĩa của từ này không?</Text>
          ) : (
            <View style={styles.answerArea}>
              <Text style={styles.furigana}>{word.furigana}</Text>
              <Text style={styles.romaji}>{word.romaji}</Text>
              <View style={styles.divider} />
              <Text style={styles.meaningLabel}>NGHĨA TIẾNG ANH</Text>
              <Text style={styles.meaning}>{word.meaning}</Text>
            </View>
          )}
        </View>

        {!vocabularyStore.isAnswerVisible ? (
          <Button title="Hiện đáp án" onPress={vocabularyStore.revealAnswer} size="lg" />
        ) : (
          <View>
            <Text style={styles.ratingHint}>Bạn nhớ từ này ở mức nào?</Text>
            <View style={styles.ratingRow}>
              <Button
                title="Quên"
                variant="danger"
                onPress={() => vocabularyStore.rateCurrentWord('again')}
                style={styles.ratingButton}
                textStyle={styles.ratingButtonText}
              />
              <Button
                title="Khó"
                variant="outline"
                onPress={() => vocabularyStore.rateCurrentWord('hard')}
                style={[styles.ratingButton, styles.hardButton]}
                textStyle={[styles.ratingButtonText, { color: colors.warning }]}
              />
              <Button
                title="Đã nhớ"
                onPress={() => vocabularyStore.rateCurrentWord('known')}
                style={[styles.ratingButton, styles.knownButton]}
                textStyle={styles.ratingButtonText}
              />
            </View>
          </View>
        )}
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Từ vựng JLPT</Text>
            <Text style={styles.subtitle}>Flashcard N5 → N1</Text>
          </View>
          <View style={styles.sessionCount}>
            <Text style={styles.sessionCountValue}>{vocabularyStore.studiedCount}</Text>
            <Text style={styles.sessionCountLabel}>lượt học</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.levelRow}
        >
          {JLPT_LEVELS.map((level) => {
            const isSelected = level === vocabularyStore.selectedLevel;
            return (
              <TouchableOpacity
                key={level}
                activeOpacity={0.75}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => void vocabularyStore.setLevel(level)}
                style={[styles.levelChip, isSelected && styles.levelChipSelected]}
              >
                <Text style={[styles.levelText, isSelected && styles.levelTextSelected]}>N{level}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.searchRow}>
          <TextInput
            value={vocabularyStore.searchQuery}
            onChangeText={vocabularyStore.setSearchQuery}
            onSubmitEditing={handleSearch}
            placeholder="Tìm từ tiếng Nhật, ví dụ: 夜更かし"
            placeholderTextColor={colors.dark.textTertiary}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.searchInput}
          />
          {vocabularyStore.activeQuery ? (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Xóa tìm kiếm"
              onPress={() => void vocabularyStore.clearSearch()}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>×</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Tìm từ vựng"
            onPress={handleSearch}
            style={styles.searchButton}
          >
            <Text style={styles.searchButtonText}>Tìm</Text>
          </TouchableOpacity>
        </View>

        {vocabularyStore.activeQuery ? (
          <Text style={styles.resultInfo}>
            {vocabularyStore.totalAvailable} kết quả cho “{vocabularyStore.activeQuery}” trong N{vocabularyStore.selectedLevel}
          </Text>
        ) : (
          <Text style={styles.resultInfo}>
            {vocabularyStore.totalAvailable || '—'} từ có sẵn · Bộ hiện tại tối đa 20 từ
          </Text>
        )}

        {renderContent()}

        <Text style={styles.sourceNote}>
          Nguồn dữ liệu: jlpt-vocab-api.vercel.app · Nghĩa hiện được API cung cấp bằng tiếng Anh.
        </Text>
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
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    color: colors.dark.textPrimary,
    fontSize: 24,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.dark.textSecondary,
    fontSize: 13,
    marginTop: 3,
  },
  sessionCount: {
    alignItems: 'center',
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderRadius: 12,
    minWidth: 70,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sessionCountValue: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '900',
  },
  sessionCountLabel: {
    color: colors.dark.textSecondary,
    fontSize: 10,
    fontWeight: '700',
  },
  levelRow: {
    gap: 8,
    paddingBottom: 14,
  },
  levelChip: {
    alignItems: 'center',
    backgroundColor: colors.dark.bgSubtle,
    borderColor: colors.dark.borderSubtle,
    borderRadius: 10,
    borderWidth: 1,
    minWidth: 56,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  levelChipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  levelText: {
    color: colors.dark.textSecondary,
    fontSize: 14,
    fontWeight: '800',
  },
  levelTextSelected: {
    color: '#FFFFFF',
  },
  searchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: colors.dark.bgSurface,
    borderColor: colors.dark.borderSubtle,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.dark.textPrimary,
    flex: 1,
    fontSize: 14,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingRight: 38,
  },
  clearButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    marginLeft: -42,
    marginRight: 6,
    width: 36,
  },
  clearButtonText: {
    color: colors.dark.textSecondary,
    fontSize: 24,
  },
  searchButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 12,
    justifyContent: 'center',
    marginLeft: 8,
    minHeight: 48,
    paddingHorizontal: 18,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  resultInfo: {
    color: colors.dark.textTertiary,
    fontSize: 11,
    marginBottom: 12,
  },
  flashcard: {
    minHeight: 430,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    color: colors.dark.textTertiary,
    fontSize: 11,
    fontWeight: '700',
  },
  wordArea: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 300,
    paddingHorizontal: 12,
    paddingVertical: 28,
  },
  word: {
    color: colors.dark.textPrimary,
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
  },
  prompt: {
    color: colors.dark.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 20,
    textAlign: 'center',
  },
  answerArea: {
    alignItems: 'center',
    marginTop: 14,
    width: '100%',
  },
  furigana: {
    color: colors.accent,
    fontSize: 21,
    fontWeight: '800',
  },
  romaji: {
    color: colors.dark.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  divider: {
    backgroundColor: colors.dark.borderSubtle,
    height: 1,
    marginVertical: 18,
    width: '70%',
  },
  meaningLabel: {
    color: colors.dark.textTertiary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  meaning: {
    color: colors.dark.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
    marginTop: 8,
    textAlign: 'center',
  },
  ratingHint: {
    color: colors.dark.textSecondary,
    fontSize: 11,
    marginBottom: 8,
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 8,
  },
  ratingButton: {
    flex: 1,
    minHeight: 46,
    paddingHorizontal: 6,
  },
  ratingButtonText: {
    fontSize: 12,
  },
  hardButton: {
    borderColor: colors.warning,
  },
  knownButton: {
    backgroundColor: colors.success,
  },
  stateCard: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 360,
    paddingHorizontal: 24,
  },
  stateEmoji: {
    fontSize: 44,
    marginBottom: 14,
  },
  stateTitle: {
    color: colors.dark.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 16,
    textAlign: 'center',
  },
  stateDescription: {
    color: colors.dark.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    textAlign: 'center',
  },
  stateButton: {
    marginTop: 20,
    minWidth: 190,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 22,
  },
  summaryItem: {
    alignItems: 'center',
    minWidth: 54,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '900',
  },
  summaryLabel: {
    color: colors.dark.textTertiary,
    fontSize: 11,
    marginTop: 3,
  },
  sourceNote: {
    color: colors.dark.textTertiary,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 14,
    paddingHorizontal: 8,
    textAlign: 'center',
  },
});

