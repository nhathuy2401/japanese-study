import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../theme/colors';
import { feedbackService, FeedbackCategory } from '../services/feedback/feedbackService';
import { Button } from './Button';

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
}

const CATEGORIES: { id: FeedbackCategory; label: string; emoji: string }[] = [
  { id: 'bug', label: 'Báo lỗi', emoji: '🐞' },
  { id: 'content', label: 'Nội dung', emoji: '📚' },
  { id: 'feature', label: 'Tính năng mới', emoji: '✨' },
  { id: 'general', label: 'Góp ý chung', emoji: '💬' },
];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ visible, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory>('general');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert('Chưa nhập nội dung', 'Vui lòng nhập lời nhắn hoặc mô tả góp ý của bạn.');
      return;
    }

    setIsSubmitting(true);
    try {
      await feedbackService.sendFeedback({
        category: selectedCategory,
        message: message.trim(),
      });
      Alert.alert(
        'Đã gửi thành công! 🎉',
        'Cảm ơn bạn đã đóng góp ý kiến để hoàn thiện Nihongo Local.',
        [{ text: 'Đóng', onPress: () => { setMessage(''); onClose(); } }]
      );
    } catch (err: any) {
      Alert.alert('Gửi chưa thành công', err.message || 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Góp ý & Báo lỗi 📝</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>
            Ý kiến của bạn sẽ được gửi trực tiếp tới bảng quản lý Google Sheets của nhà phát triển.
          </Text>

          <Text style={styles.sectionLabel}>CHỦ ĐỀ</Text>
          <View style={styles.categoriesRow}>
            {CATEGORIES.map((cat) => {
              const isSelected = cat.id === selectedCategory;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                  onPress={() => setSelectedCategory(cat.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.chipEmoji}>{cat.emoji}</Text>
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionLabel}>NỘI DUNG GÓP Ý</Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={4}
            placeholder="Mô tả chi tiết góp ý hoặc lỗi bạn gặp phải..."
            placeholderTextColor={colors.dark.textTertiary}
            value={message}
            onChangeText={setMessage}
            textAlignVertical="top"
          />

          <View style={styles.actionRow}>
            <Button
              title="Hủy"
              variant="outline"
              onPress={onClose}
              style={{ flex: 1 }}
              disabled={isSubmitting}
            />
            <Button
              title={isSubmitting ? 'Đang gửi...' : 'Gửi góp ý'}
              onPress={handleSubmit}
              style={{ flex: 2 }}
              disabled={isSubmitting}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.dark.bgSurface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    borderWidth: 1,
    borderColor: colors.dark.borderSubtle,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.dark.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 20,
    color: colors.dark.textSecondary,
  },
  description: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    marginBottom: 16,
    lineHeight: 18,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: colors.dark.textTertiary,
    marginBottom: 8,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.bgSubtle,
    borderWidth: 1,
    borderColor: colors.dark.borderSubtle,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  categoryChipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipEmoji: {
    fontSize: 14,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.dark.textSecondary,
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  textInput: {
    backgroundColor: colors.dark.bgCanvas,
    borderWidth: 1,
    borderColor: colors.dark.borderSubtle,
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    color: colors.dark.textPrimary,
    minHeight: 110,
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
});

