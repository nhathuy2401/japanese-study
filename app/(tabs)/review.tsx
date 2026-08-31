import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { observer } from 'mobx-react-lite';
import { useReviewStore } from '../../src/stores/StoreContext';
import { colors } from '../../src/theme/colors';
import { SrsReviewCard } from '../../src/components/SrsReviewCard';
import { Button } from '../../src/components/Button';

export default observer(function ReviewScreen() {
  const reviewStore = useReviewStore();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ÔN TẬP SRS (FSRS ENGINE)</Text>
          <Text style={styles.headerSubtitle}>
            Ghi nhớ dài hạn thông qua khoảng cách ôn tập thông minh
          </Text>
        </View>

        {/* Review Session Runner */}
        {reviewStore.isSessionFinished ? (
          <View style={styles.finishedContainer}>
            <Text style={styles.congratsEmoji}>🎉</Text>
            <Text style={styles.congratsTitle}>Hoàn thành xuất sắc!</Text>
            <Text style={styles.congratsDesc}>
              Bạn đã ôn tập xong toàn bộ thẻ đến hạn hôm nay. Hãy quay lại vào ngày mai để duy trì chuỗi nhớ nhé!
            </Text>
            <Button
              title="↺ Ôn tập lại danh sách này"
              variant="outline"
              onPress={() => reviewStore.resetSession()}
              style={styles.resetBtn}
            />
          </View>
        ) : reviewStore.currentCard ? (
          <SrsReviewCard card={reviewStore.currentCard} />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>☕</Text>
            <Text style={styles.emptyTitle}>Không có thẻ nào đến hạn</Text>
            <Text style={styles.emptyDesc}>Hãy thư giãn hoặc học thêm bài mới!</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.dark.bgCanvas,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 12,
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
  },
  finishedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  congratsEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  congratsTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.dark.textPrimary,
    marginBottom: 8,
  },
  congratsDesc: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  resetBtn: {
    minWidth: 200,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
});
