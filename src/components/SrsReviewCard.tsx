import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react-lite';
import { SrsCardData, SrsRating } from '../domain/entities/types';
import { useReviewStore, useSettingsStore, useAppTheme } from '../stores/StoreContext';
import { colors } from '../theme/colors';
import { FuriganaText } from './FuriganaText';
import { toRomaji } from '../utils/romajiHelper';

interface SrsReviewCardProps {
  card: SrsCardData;
}

export const SrsReviewCard: React.FC<SrsReviewCardProps> = observer(({ card }) => {
  const reviewStore = useReviewStore();
  const settings = useSettingsStore();
  const theme = useAppTheme();
  const intervals = reviewStore.projectedIntervals;

  const handleRating = (rating: SrsRating) => {
    reviewStore.rateCard(rating);
  };

  return (
    <View style={styles.container}>
      {/* Top Bar: Queue progress & Undo */}
      <View style={styles.topBar}>
        <Text style={[styles.queueCount, { color: theme.textSecondary }]}>
          Còn lại: <Text style={[styles.queueCountHighlight, { color: theme.textPrimary }]}>{reviewStore.remainingCount}</Text> thẻ
        </Text>
        {reviewStore.undoHistory && (
          <TouchableOpacity
            style={[styles.undoBtn, { backgroundColor: theme.bgSubtle }]}
            onPress={() => reviewStore.undo()}
          >
            <Text style={[styles.undoText, { color: theme.textSecondary }]}>↩️ Hoàn tác</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Flashcard Body */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => reviewStore.flipCard()}
        style={[
          styles.cardBody,
          {
            backgroundColor: theme.bgSurface,
            borderColor: theme.borderSubtle,
          },
        ]}
      >
        {/* Card Type Badge */}
        <View style={[styles.typeBadge, { backgroundColor: theme.bgSubtle }]}>
          <Text style={[styles.typeBadgeText, { color: theme.textSecondary }]}>
            {card.contentType.toUpperCase()} • {card.state.toUpperCase()}
          </Text>
        </View>

        {/* Prompt (Front) */}
        <View style={styles.promptArea}>
          <Text style={[styles.promptText, { color: theme.textPrimary }]}>{card.prompt}</Text>
          {card.reading && reviewStore.isFlipped && (
            <Text style={[styles.readingText, { color: theme.accent }]}>[{card.reading}]</Text>
          )}
          {settings.showRomaji && (
            <Text style={[styles.romajiPromptText, { color: theme.accent }]}>
              /{toRomaji(card.reading || card.prompt)}/
            </Text>
          )}
        </View>

        {/* Answer (Back) - Revealed after tap */}
        {reviewStore.isFlipped ? (
          <View style={styles.answerArea}>
            <View style={[styles.divider, { backgroundColor: theme.borderSubtle }]} />
            <Text style={[styles.answerText, { color: theme.textPrimary }]}>{card.answer}</Text>
            {card.extraInfo && <Text style={styles.extraInfo}>{card.extraInfo}</Text>}
            {card.exampleSentence && (
              <View style={[styles.exampleBox, { backgroundColor: theme.bgSubtle }]}>
                <FuriganaText
                  text={card.exampleSentence}
                  fontSize={15}
                  furiganaFontSize={9}
                  style={{ marginBottom: 4 }}
                />
                {settings.showRomaji && (
                  <Text style={[styles.exampleRomajiText, { color: theme.textSecondary }]}>
                    {toRomaji(card.exampleSentence)}
                  </Text>
                )}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.tapPrompt}>
            <Text style={[styles.tapPromptText, { color: theme.textTertiary }]}>👆 Chạm vào thẻ để lật xem đáp án</Text>
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
            <Text style={styles.rateBtnTitle}>NHỚ TỐT</Text>
            <Text style={styles.rateBtnTime}>{intervals[3]}</Text>
          </TouchableOpacity>

          {/* Easy (4) */}
          <TouchableOpacity
            style={[styles.rateBtn, { backgroundColor: colors.srs.easy }]}
            onPress={() => handleRating(4)}
          >
            <Text style={styles.rateBtnTitle}>RẤT DỄ</Text>
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
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  queueCount: {
    fontSize: 13,
  },
  queueCountHighlight: {
    fontWeight: '800',
  },
  undoBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  undoText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    flex: 1,
    minHeight: 280,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  typeBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  promptArea: {
    alignItems: 'center',
    marginVertical: 12,
  },
  promptText: {
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
  },
  readingText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
  },
  romajiPromptText: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  answerArea: {
    width: '100%',
    alignItems: 'center',
  },
  divider: {
    width: '80%',
    height: 1,
    marginVertical: 16,
  },
  answerText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  extraInfo: {
    fontSize: 13,
    color: '#818CF8',
    marginTop: 6,
  },
  exampleBox: {
    padding: 12,
    borderRadius: 12,
    marginTop: 14,
    width: '100%',
  },
  exampleRomajiText: {
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 4,
    opacity: 0.85,
  },
  tapPrompt: {
    marginTop: 20,
  },
  tapPromptText: {
    fontSize: 13,
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
