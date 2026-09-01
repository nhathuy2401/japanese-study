import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { observer } from 'mobx-react-lite';
import { useNotebookStore, useReviewStore, useAppTheme } from '../../src/stores/StoreContext';
import { colors } from '../../src/theme/colors';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { hapticService } from '../../src/services/haptics/hapticService';

export default observer(function NotebookScreen() {
  const notebook = useNotebookStore();
  const review = useReviewStore();
  const theme = useAppTheme();

  const [inputJp, setInputJp] = useState('');
  const [inputVi, setInputVi] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSaveNewSentence = () => {
    if (!inputJp.trim() || !inputVi.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập cả câu tiếng Nhật và nghĩa tiếng Việt.');
      return;
    }

    notebook.addSentence(inputJp, inputVi, ['#Mine', '#UserAdded']);
    setInputJp('');
    setInputVi('');
    setIsAdding(false);
  };

  const handleMakeCloze = (sentenceId: string, word: string) => {
    notebook.setClozeTarget(sentenceId, word);
    Alert.alert('Đã tạo thẻ Cloze', `Đã che từ "${word}" để tạo bài tập điền từ ôn tập!`);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bgCanvas }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>SỔ TAY & SENTENCE MINING</Text>
            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
              Lưu trữ câu đời thực từ Manga, Anime, Tin tức và tạo thẻ SRS 1-chạm
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.addToggleBtn, { backgroundColor: theme.accentBg, borderColor: theme.accent }]}
            onPress={() => setIsAdding((prev) => !prev)}
          >
            <Text style={[styles.addToggleText, { color: theme.accent }]}>{isAdding ? '✕ Đóng' : '➕ Thêm câu'}</Text>
          </TouchableOpacity>
        </View>

        {/* Add New Sentence Form */}
        {isAdding && (
          <Card style={[styles.addCard, { backgroundColor: theme.bgSurface, borderColor: theme.borderSubtle }]}>
            <Text style={[styles.formTitle, { color: theme.textPrimary }]}>ĐÀO CÂU MỚI (SENTENCE MINE)</Text>
            <TextInput
              placeholder="Nhập câu tiếng Nhật (vd: そんなつもりじゃなかったのに...)"
              placeholderTextColor={theme.textTertiary}
              value={inputJp}
              onChangeText={setInputJp}
              style={[styles.textInput, { backgroundColor: theme.bgSubtle, borderColor: theme.borderSubtle, color: theme.textPrimary }]}
            />
            <TextInput
              placeholder="Nghĩa tiếng Việt (vd: Tôi không hề có ý đó...)"
              placeholderTextColor={theme.textTertiary}
              value={inputVi}
              onChangeText={setInputVi}
              style={[styles.textInput, { backgroundColor: theme.bgSubtle, borderColor: theme.borderSubtle, color: theme.textPrimary }]}
            />
            <Button
              title="💾 Lưu câu vào Sổ tay"
              variant="accent"
              onPress={handleSaveNewSentence}
              style={theme.mode === 'light' ? { backgroundColor: theme.accent } : undefined}
            />
          </Card>
        )}

        {/* 1-Tap Cloze Instructions */}
        <View style={[styles.tipBox, { backgroundColor: theme.bgSubtle, borderColor: theme.borderSubtle }]}>
          <Text style={[styles.tipTitle, { color: theme.accent }]}>💡 MẸO TẠO THẺ CLOZE (ĐIỀN TỪ) 1-CHẠM:</Text>
          <Text style={[styles.tipText, { color: theme.textSecondary }]}>
            Chạm vào bất kỳ từ nào được gạch chân trong câu dưới đây để che từ đó thành câu đố ôn tập!
          </Text>
        </View>

        {/* Saved Sentences List */}
        <View style={styles.sentencesList}>
          {notebook.savedSentences.map((item) => {
            const words = item.japanese.split(' ');
            return (
              <Card key={item.id} style={[styles.sentenceCard, { backgroundColor: theme.bgSurface, borderColor: theme.borderSubtle }]}>
                <View style={styles.cardTopRow}>
                  <View style={styles.tagsRow}>
                    {item.tags.map((tag, idx) => (
                      <View key={idx} style={[styles.tagPill, { backgroundColor: theme.bgSubtle }]}>
                        <Text style={[styles.tagText, { color: theme.textSecondary }]}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity
                    onPress={() => notebook.removeSentence(item.id)}
                    style={styles.deleteBtn}
                  >
                    <Text style={styles.deleteText}>🗑️</Text>
                  </TouchableOpacity>
                </View>

                {/* Interactive Cloze clickable words */}
                <View style={styles.wordsWrap}>
                  {words.map((w, wIdx) => {
                    const isClozed = item.clozeTarget === w;
                    return (
                      <TouchableOpacity
                        key={wIdx}
                        onPress={() => handleMakeCloze(item.id, w)}
                        style={[
                          styles.wordPill,
                          { backgroundColor: theme.bgSubtle, borderColor: theme.borderSubtle },
                          isClozed && styles.wordPillClozed,
                        ]}
                      >
                        <Text style={[styles.wordText, { color: theme.textPrimary }, isClozed && styles.wordTextClozed]}>
                          {isClozed ? '[ • • • ]' : w}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={[styles.sentenceVi, { color: theme.textSecondary }]}>💬 {item.meaningVi}</Text>
              </Card>
            );
          })}
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
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.dark.textPrimary,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    maxWidth: 240,
  },
  addToggleBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addToggleText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  addCard: {
    backgroundColor: colors.dark.bgSurface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.accent,
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: colors.dark.bgSubtle,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.dark.textPrimary,
    fontSize: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.dark.borderSubtle,
  },
  tipBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
    marginBottom: 16,
  },
  tipTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.warning,
    marginBottom: 2,
  },
  tipText: {
    fontSize: 12,
    color: colors.dark.textSecondary,
    lineHeight: 16,
  },
  sentencesList: {
    gap: 12,
  },
  sentenceCard: {
    backgroundColor: colors.dark.bgSurface,
    borderRadius: 16,
    padding: 16,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tagPill: {
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    color: '#818CF8',
    fontWeight: '600',
  },
  deleteBtn: {
    padding: 4,
  },
  deleteText: {
    fontSize: 14,
  },
  wordsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 6,
  },
  wordPill: {
    backgroundColor: colors.dark.bgSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  wordPillClozed: {
    backgroundColor: 'rgba(244, 63, 94, 0.18)',
    borderColor: colors.accent,
  },
  wordText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },
  wordTextClozed: {
    color: colors.accent,
  },
  sentenceVi: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    marginTop: 8,
  },
});

