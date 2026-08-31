import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useAiStore, useNotebookStore } from '../stores/StoreContext';
import { colors } from '../theme/colors';

export const AiTutorBottomSheet: React.FC = observer(() => {
  const aiStore = useAiStore();
  const notebookStore = useNotebookStore();

  if (!aiStore.isSheetOpen) return null;

  const handleSaveToNotebook = () => {
    if (aiStore.grammarExplanation) {
      notebookStore.addSentence(
        `AI Note: ${aiStore.grammarExplanation.simpleExplanationVi}`,
        aiStore.grammarExplanation.practicalNuance,
        ['#AiExplanation']
      );
      aiStore.closeAiSheet();
    }
  };

  return (
    <Modal
      visible={aiStore.isSheetOpen}
      transparent
      animationType="slide"
      onRequestClose={() => aiStore.closeAiSheet()}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={styles.robotIcon}>🤖</Text>
              <Text style={styles.headerTitle}>TRỢ GIẢNG GEMINI AI</Text>
            </View>
            <TouchableOpacity onPress={() => aiStore.closeAiSheet()} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.contentScroll}>
            {/* Loading state */}
            {aiStore.isLoading && (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color={colors.accent} />
                <Text style={styles.loadingText}>Gemini đang phân tích câu hỏi...</Text>
              </View>
            )}

            {/* Error state */}
            {aiStore.errorMessage && (
              <View style={styles.errorBox}>
                <Text style={styles.errorTitle}>⚠️ Không thể kết nối AI</Text>
                <Text style={styles.errorDesc}>{aiStore.errorMessage}</Text>
              </View>
            )}

            {/* Grammar Explanation Response */}
            {aiStore.grammarExplanation && (
              <View style={styles.resultBox}>
                <Text style={styles.sectionHeader}>💡 Giải thích dễ hiểu:</Text>
                <Text style={styles.mainText}>
                  {aiStore.grammarExplanation.simpleExplanationVi}
                </Text>

                <Text style={styles.sectionHeader}>🎯 Sắc thái đời sống:</Text>
                <Text style={styles.nuanceText}>
                  {aiStore.grammarExplanation.practicalNuance}
                </Text>

                {aiStore.grammarExplanation.examples && (
                  <View style={styles.examplesContainer}>
                    <Text style={styles.sectionHeader}>📝 Ví dụ bổ sung:</Text>
                    {aiStore.grammarExplanation.examples.map((ex, idx) => (
                      <View key={idx} style={styles.exampleItem}>
                        <Text style={styles.exampleJp}>{ex.japanese}</Text>
                        <Text style={styles.exampleReading}>({ex.reading})</Text>
                        <Text style={styles.exampleVi}>➔ {ex.meaningVi}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveToNotebook}>
                  <Text style={styles.saveBtnText}>⭐ Lưu giải thích này vào Sổ tay</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Writing Feedback Response */}
            {aiStore.writingFeedback && (
              <View style={styles.resultBox}>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>
                    {aiStore.writingFeedback.isGrammaticallyValid ? '✅ Đúng ngữ pháp' : '❌ Cần chỉnh sửa'}
                  </Text>
                </View>

                <Text style={styles.sectionHeader}>✨ Câu chỉnh sửa tự nhiên:</Text>
                <Text style={styles.correctedJp}>
                  {aiStore.writingFeedback.correctedSentence}
                </Text>

                <Text style={styles.sectionHeader}>💬 Nhận xét chi tiết:</Text>
                <Text style={styles.mainText}>
                  {aiStore.writingFeedback.explanationVi}
                </Text>

                {aiStore.writingFeedback.caution && (
                  <View style={styles.cautionBox}>
                    <Text style={styles.cautionText}>
                      ⚠️ Chú ý: {aiStore.writingFeedback.caution}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.dark.bgSurface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    padding: 20,
    borderTopWidth: 1,
    borderColor: colors.dark.borderSubtle,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.borderSubtle,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  robotIcon: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '700',
  },
  contentScroll: {
    marginVertical: 4,
  },
  loadingBox: {
    alignItems: 'center',
    paddingVertical: 36,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 12,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.danger,
  },
  errorTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.danger,
    marginBottom: 4,
  },
  errorDesc: {
    fontSize: 12,
    color: colors.dark.textSecondary,
  },
  resultBox: {
    gap: 8,
  },
  statusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.success,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    marginTop: 6,
  },
  mainText: {
    fontSize: 14,
    color: colors.dark.textPrimary,
    lineHeight: 20,
  },
  nuanceText: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    lineHeight: 18,
  },
  correctedJp: {
    fontSize: 18,
    fontWeight: '800',
    color: '#818CF8',
    marginVertical: 4,
  },
  examplesContainer: {
    backgroundColor: colors.dark.bgSubtle,
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
  },
  exampleItem: {
    marginVertical: 4,
  },
  exampleJp: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },
  exampleReading: {
    fontSize: 12,
    color: colors.accent,
  },
  exampleVi: {
    fontSize: 12,
    color: '#94A3B8',
  },
  cautionBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  cautionText: {
    fontSize: 12,
    color: colors.warning,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});

