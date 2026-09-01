import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { observer } from 'mobx-react-lite';
import { useReviewStore, useAppTheme } from '../../src/stores/StoreContext';
import { SrsReviewCard } from '../../src/components/SrsReviewCard';
import { Button } from '../../src/components/Button';

export default observer(function ReviewScreen() {
  const reviewStore = useReviewStore();
  const theme = useAppTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bgCanvas }]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>ÔN TẬP SRS (FSRS ENGINE)</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            Ghi nhớ dài hạn thông qua khoảng cách ôn tập thông minh
          </Text>
        </View>

        {/* Review Session Runner */}
        {reviewStore.isSessionFinished ? (
          <View style={styles.finishedContainer}>
            <Text style={styles.congratsEmoji}>🎉</Text>
            <Text style={[styles.congratsTitle, { color: theme.textPrimary }]}>Hoàn thành xuất sắc!</Text>
            <Text style={[styles.congratsDesc, { color: theme.textSecondary }]}>
              Bạn đã ôn tập xong toàn bộ thẻ đến hạn hôm nay. Hãy quay lại vào ngày mai để duy trì chuỗi nhớ nhé!
            </Text>
            <Button
              title="↺ Ôn tập lại danh sách này"
              variant="outline"
              onPress={() => reviewStore.resetSession()}
              style={styles.resetBtn}
              textStyle={theme.mode === 'light' ? { color: theme.accent } : undefined}
            />
          </View>
        ) : reviewStore.currentCard ? (
          <SrsReviewCard card={reviewStore.currentCard} />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>☕</Text>
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Không có thẻ nào đến hạn</Text>
            <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>Hãy thư giãn hoặc học thêm bài mới!</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
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
    marginBottom: 8,
  },
  congratsDesc: {
    fontSize: 14,
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
  },
  emptyDesc: {
    fontSize: 13,
    marginTop: 4,
  },
});
