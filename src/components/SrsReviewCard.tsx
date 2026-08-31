import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react-lite';
import { SrsCardData, SrsRating } from '../domain/entities/types';
import { useReviewStore } from '../stores/StoreContext';
import { colors } from '../theme/colors';

interface SrsReviewCardProps {
  card: SrsCardData;
}

export const SrsReviewCard: React.FC<SrsReviewCardProps> = observer(({ card }) => {
  const reviewStore = useReviewStore();
  const intervals = reviewStore.projectedIntervals;

  const handleRating = (rating: SrsRating) => {
    reviewStore.rateCard(rating);
  };

  return (
    <View style={styles.container}>
      {/* Top Bar: Queue progress & Undo */}
      <View style={styles.topBar}>
        <Text style={styles.queueCount}>
          Còn lại: <Text style={styles.queueCountHighlight}>{reviewStore.remainingCount}</Text> thẻ
        </Text>
        {reviewStore.undoHistory && (
          <TouchableOpacity style={styles.undoBtn} onPress={() => reviewStore.undo()}>
            <Text style={styles.undoText}>↩️ Hoàn tác</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Flashcard Body */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => reviewStore.flipCard()}
        style={styles.cardBody}
      >
        {/* Card Type Badge */}
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>
            {card.contentType.toUpperCase()} • {card.state.toUpperCase()}
          </Text>
        </View>

        {/* Prompt (Front) */}
        <View style={styles.promptArea}>
          <Text style={styles.promptText}>{card.prompt}</Text>
          {card.reading && reviewStore.isFlipped && (
            <Text style={styles.readingText}>[{card.reading}]</Text>
          )}
        </View>

        {/* Answer (Back) - Revealed after tap */}
        {reviewStore.isFlipped ? (
          <View style={styles.answerArea}>
            <View style={styles.divider} />
            <Text style={styles.answerText}>{card.answer}</Text>
            {card.extraInfo && <Text style={styles.extraInfo}>{card.extraInfo}</Text>}
            {card.exampleSentence && (
              <View style={styles.exampleBox}>
                <Text style={styles.exampleText}>💬 {card.exampleSentence}</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.tapPrompt}>
            <Text style={styles.tapPromptText}>👆 Chạm vào thẻ để lật xem đáp án</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Rating Buttons with FSRS Predicted Time Intervals */}
      {reviewStore.isFlipped && (
        <View style={styles.ratingRow}>
          {/* Again (1) */}
          <TouchableOpacity
            style={[styles.rateBtn, { backgroundColor: colors.srs.again }]}
            onPress={() => handleRating(1)}
          >
            <Text style={styles.rateBtnTitle}>QUÊN</Text>
            <Text style={styles.rateBtnTime}>{intervals[1]}</Text>
          </TouchableOpacity>

          {/* Hard (2) */}
          <TouchableOpacity
            style={[styles.rateBtn, { backgroundColor: colors.srs.hard }]}
            onPress={() => handleRating(2)}
          >
            <Text style={styles.rateBtnTitle}>KHÓ</Text>
            <Text style={styles.rateBtnTime}>{intervals[2]}</Text>
          </TouchableOpacity>

          {/* Good (3) */}
          <TouchableOpacity
            style={[styles.rateBtn, { backgroundColor: colors.srs.good }]}
            onPress={() => handleRating(3)}
          >
            <Text style={styles.rateBtnTitle}>ĐƯỢC</Text>
            <Text style={styles.rateBtnTime}>{intervals[3]}</Text>
          </TouchableOpacity>

          {/* Easy (4) */}
          <TouchableOpacity
            style={[styles.rateBtn, { backgroundColor: colors.srs.easy }]}
            onPress={() => handleRating(4)}
          >
            <Text style={styles.rateBtnTitle}>DỄ</Text>
            <Text style={styles.rateBtnTime}>{intervals[4]}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  queueCount: {
    fontSize: 13,
    color: '#94A3B8',
  },
  queueCountHighlight: {
    color: colors.dark.textPrimary,
    fontWeight: '800',
  },
  undoBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  undoText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  cardBody: {
    flex: 1,
    minHeight: 280,
    backgroundColor: colors.dark.bgSurface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: colors.dark.borderSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  typeBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: colors.dark.bgSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  promptArea: {
    alignItems: 'center',
    marginVertical: 12,
  },
  promptText: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.dark.textPrimary,
    textAlign: 'center',
  },
  readingText: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: '600',
    marginTop: 6,
  },
  answerArea: {
    width: '100%',
    alignItems: 'center',
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: colors.dark.borderSubtle,
    marginVertical: 16,
  },
  answerText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark.textPrimary,
    textAlign: 'center',
  },
  extraInfo: {
    fontSize: 13,
    color: '#818CF8',
    marginTop: 6,
  },
  exampleBox: {
    backgroundColor: colors.dark.bgSubtle,
    padding: 12,
    borderRadius: 12,
    marginTop: 14,
    width: '100%',
  },
  exampleText: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
  },
  tapPrompt: {
    marginTop: 20,
  },
  tapPromptText: {
    fontSize: 13,
    color: '#64748B',
    fontStyle: 'italic',
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  rateBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  rateBtnTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  rateBtnTime: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});
