import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { observer } from 'mobx-react-lite';
import { JapaneseToken } from '../domain/entities/types';
import { useSettingsStore, useNotebookStore, useAppTheme } from '../stores/StoreContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { hapticService } from '../services/haptics/hapticService';
import { PitchVisualizer } from './PitchVisualizer';

import { parseFurigana } from '../utils/furiganaHelper';
import { toRomaji } from '../utils/romajiHelper';

interface InteractiveSentenceProps {
  tokens?: JapaneseToken[];
  sentence?: string;
  meaningVi: string;
  romajiSentence?: string;
  onAudioPlay?: () => void;
}

export const InteractiveSentence: React.FC<InteractiveSentenceProps> = observer(({
  tokens,
  sentence,
  meaningVi,
  romajiSentence,
  onAudioPlay,
}) => {
  const settings = useSettingsStore();
  const notebook = useNotebookStore();
  const theme = useAppTheme();
  const [selectedToken, setSelectedToken] = useState<JapaneseToken | null>(null);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  // Tự động phân tích và gán Furigana chính xác cho các token có Kanji
  const effectiveTokens = React.useMemo(() => {
    if (tokens && tokens.length > 0) {
      return tokens.map((token, i) => {
        if (token.kanji && (!token.furigana || token.furigana === token.kanji)) {
          const segs = parseFurigana(token.kanji);
          const furi = segs
            .map((s) => s.furigana || s.text)
            .join('');
          if (furi && furi !== token.kanji) {
            return { ...token, furigana: furi };
          }
        }
        return token;
      });
    }

    if (sentence) {
      const segs = parseFurigana(sentence);
      return segs.map((s, i) => ({
        id: `seg-${i}`,
        kanji: s.text,
        furigana: s.furigana || s.text,
        meaningVi: '',
        pos: s.isKanji ? 'Từ Kanji' : 'Trợ từ / Kana',
      }));
    }

    return [];
  }, [tokens, sentence]);

  const handleTokenPress = (token: JapaneseToken) => {
    hapticService.light();
    // In tap-to-reveal mode, toggle furigana reveal
    if (settings.furiganaMode === 'tap-to-reveal') {
      setRevealedIds((prev) => ({ ...prev, [token.id]: !prev[token.id] }));
    }
    // Also open the quick inspector modal
    setSelectedToken(token);
  };

  const isFuriganaVisible = (token: JapaneseToken) => {
    if (!token.furigana || token.furigana === token.kanji) return false;
    if (settings.furiganaMode === 'always') return true;
    if (settings.furiganaMode === 'tap-to-reveal') return !!revealedIds[token.id];
    return false; // 'hidden' mode
  };

  const handleSaveToNotebook = () => {
    if (selectedToken) {
      notebook.addSentence(
        `${selectedToken.kanji || selectedToken.furigana} (${meaningVi})`,
        selectedToken.meaningVi,
        ['#TokenSaved', `#${selectedToken.pos || 'Word'}`]
      );
      setSelectedToken(null);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bgSurface, borderColor: theme.borderSubtle }]}>
      {/* Action header with audio button */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerLabel, { color: theme.textSecondary }]}>CÂU VÍ DỤ TƯƠNG TÁC</Text>
        {onAudioPlay && (
          <TouchableOpacity onPress={onAudioPlay} style={[styles.audioBtn, { backgroundColor: theme.bgSubtle }]}>
            <Text style={[styles.audioIcon, { color: theme.accent }]}>🔊 Phát âm</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Japanese interactive tokens wrap */}
      <View style={styles.tokensWrapper}>
        {effectiveTokens.map((token) => {
          const showFuri = isFuriganaVisible(token);
          return (
            <TouchableOpacity
              key={token.id}
              activeOpacity={0.7}
              onPress={() => handleTokenPress(token)}
              style={[styles.tokenPill, { backgroundColor: theme.bgSubtle, borderColor: theme.borderSubtle }]}
            >
              {/* Furigana row */}
              <View style={styles.furiganaContainer}>
                {token.furigana && token.furigana !== token.kanji ? (
                  <Text
                    style={[
                      styles.furiganaText,
                      { color: theme.accent },
                      !showFuri && settings.furiganaMode === 'tap-to-reveal' && styles.furiganaMasked,
                    ]}
                  >
                    {showFuri ? token.furigana : '• • •'}
                  </Text>
                ) : (
                  <Text style={styles.furiganaPlaceholder}> </Text>
                )}
              </View>

              {/* Main Kanji/Kana character */}
              <Text style={[styles.mainCharText, { color: theme.textPrimary }]}>{token.kanji || token.furigana}</Text>

              {/* Optional Part of Speech hint */}
              {token.pos && <Text style={[styles.posHint, { color: theme.textTertiary }]}>{token.pos}</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Romaji row if enabled */}
      {settings.showRomaji && (
        <Text style={[styles.romajiText, { color: theme.textSecondary }]}>
          {romajiSentence || toRomaji(sentence || (tokens ? tokens.map((t) => t.kanji).join('') : ''))}
        </Text>
      )}

      {/* Vietnamese translation */}
      <View style={[styles.translationBox, { backgroundColor: theme.bgSubtle }]}>
        <Text style={[styles.translationText, { color: theme.textPrimary }]}>💬 {meaningVi}</Text>
      </View>

      {/* Quick Inspector Modal for tapped word */}
      <Modal
        visible={!!selectedToken}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedToken(null)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setSelectedToken(null)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.bgSurface, borderColor: theme.borderSubtle }]}>
            {selectedToken && (
              <>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={[styles.modalKanji, { color: theme.textPrimary }]}>
                      {selectedToken.kanji || selectedToken.furigana}
                    </Text>
                    {selectedToken.furigana && selectedToken.furigana !== selectedToken.kanji && (
                      <Text style={[styles.modalReading, { color: theme.accent }]}>[{selectedToken.furigana}]</Text>
                    )}
                  </View>
                  {selectedToken.hanViet && (
                    <View style={[styles.hanVietBadge, { backgroundColor: theme.bgSubtle }]}>
                      <Text style={[styles.hanVietText, { color: theme.accent }]}>Hán Việt: {selectedToken.hanViet}</Text>
                    </View>
                  )}
                </View>

                <View style={[styles.modalDivider, { backgroundColor: theme.borderSubtle }]} />

                <Text style={[styles.modalMeaning, { color: theme.textSecondary }]}>
                  Nghĩa: <Text style={[styles.modalMeaningBold, { color: theme.textPrimary }]}>{selectedToken.meaningVi}</Text>
                </Text>
                {selectedToken.pos && (
                  <Text style={[styles.modalPos, { color: theme.textTertiary }]}>Từ loại: {selectedToken.pos}</Text>
                )}

                {/* Pitch Accent contour if available */}
                {selectedToken.pitchPattern && (
                  <View style={styles.pitchSection}>
                    <Text style={[styles.pitchSectionTitle, { color: theme.textSecondary }]}>Cao độ Pitch Accent:</Text>
                    <PitchVisualizer pattern={selectedToken.pitchPattern} />
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.saveNotebookBtn, { backgroundColor: theme.mode === 'light' ? theme.accentBg : 'rgba(244, 63, 94, 0.15)', borderColor: theme.accent }]}
                  onPress={handleSaveToNotebook}
                >
                  <Text style={[styles.saveNotebookText, { color: theme.accent }]}>⭐ Lưu vào Sổ tay cá nhân</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark.bgSurface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.dark.borderSubtle,
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  audioBtn: {
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  audioIcon: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
  },
  tokensWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    gap: 6,
    marginVertical: 4,
  },
  tokenPill: {
    alignItems: 'center',
    backgroundColor: colors.dark.bgSubtle,
    paddingHorizontal: 6,
    paddingBottom: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  furiganaContainer: {
    minHeight: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  furiganaText: {
    ...typography.japanese.furigana,
    color: '#94A3B8',
  },
  furiganaMasked: {
    color: '#475569',
    fontSize: 9,
  },
  furiganaPlaceholder: {
    fontSize: 11,
  },
  mainCharText: {
    ...typography.japanese.characterMedium,
    color: colors.dark.textPrimary,
  },
  posHint: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 2,
  },
  romajiText: {
    ...typography.japanese.romaji,
    color: '#94A3B8',
    marginTop: 8,
    fontStyle: 'italic',
  },
  translationBox: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.dark.borderSubtle,
  },
  translationText: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    lineHeight: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: colors.dark.bgSurface,
    width: '100%',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.dark.borderSubtle,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalKanji: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.dark.textPrimary,
  },
  modalReading: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '600',
    marginTop: 2,
  },
  hanVietBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  hanVietText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#818CF8',
  },
  modalDivider: {
    height: 1,
    backgroundColor: colors.dark.borderSubtle,
    marginVertical: 14,
  },
  modalMeaning: {
    fontSize: 15,
    color: colors.dark.textSecondary,
    marginBottom: 6,
  },
  modalMeaningBold: {
    color: colors.dark.textPrimary,
    fontWeight: '700',
  },
  modalPos: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
  },
  pitchSection: {
    marginVertical: 10,
    backgroundColor: colors.dark.bgSubtle,
    padding: 12,
    borderRadius: 12,
  },
  pitchSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 6,
  },
  saveNotebookBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  saveNotebookText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});

