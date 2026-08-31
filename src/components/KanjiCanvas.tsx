import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DomainKanji } from '../domain/entities/types';
import { colors } from '../theme/colors';
import { hapticService } from '../services/haptics/hapticService';

interface KanjiCanvasProps {
  kanji: DomainKanji;
}

export const KanjiCanvas: React.FC<KanjiCanvasProps> = ({ kanji }) => {
  const [showHint, setShowHint] = useState<boolean>(true);

  const toggleHint = () => {
    setShowHint((prev) => !prev);
    hapticService.light();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            KANJI N5: {kanji.character} ({kanji.meaningsVi.join(', ')})
          </Text>
          <Text style={styles.subtitle}>Số nét: {kanji.strokeCount || 'N/A'}</Text>
        </View>
      </View>

      {/* Main Grid + Breakdown Row */}
      <View style={styles.mainRow}>
        {/* Rice Grid (Lưới chữ Mễ 米) */}
        <View style={styles.canvasWrapper}>
          <View style={styles.riceGrid}>
            {/* Diagonal & Center Grid Lines */}
            <View style={styles.gridLineHorizontal} />
            <View style={styles.gridLineVertical} />
            <View style={styles.gridLineDiagonal1} />
            <View style={styles.gridLineDiagonal2} />

            {/* Kanji Character Ghost Guide */}
            <Text style={[styles.ghostKanji, !showHint && styles.hiddenGhost]}>
              {kanji.character}
            </Text>
          </View>

          {/* Canvas Actions */}
          <View style={styles.canvasActions}>
            <TouchableOpacity style={styles.hintBtn} onPress={toggleHint}>
              <Text style={styles.hintBtnText}>{showHint ? '👁️ Ẩn nét mờ' : '👁️ Hiện gợi ý'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Radical Breakdown & Mnemonic Story */}
        <View style={styles.infoWrapper}>
          <Text style={styles.sectionTitle}>PHÂN RÃ THÀNH PHẦN</Text>
          <View style={styles.radicalsList}>
            {kanji.radicals.map((rad, idx) => (
              <View key={idx} style={styles.radicalItem}>
                <Text style={styles.radicalSymbol}>{rad.symbol}</Text>
                <View style={styles.radicalDetail}>
                  <Text style={styles.radicalName}>{rad.name}</Text>
                  <Text style={styles.radicalMeaning}>({rad.meaningVi})</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Mnemonic Story */}
          {kanji.mnemonic && (
            <View style={styles.mnemonicBox}>
              <Text style={styles.mnemonicTitle}>💡 CÂU CHUYỆN GỢI NHỚ:</Text>
              <Text style={styles.mnemonicText}>{kanji.mnemonic}</Text>
            </View>
          )}

          {/* On/Kun readings */}
          <View style={styles.readingRow}>
            <Text style={styles.readingLabel}>• On: <Text style={styles.readingVal}>{kanji.onyomi.join(', ')}</Text></Text>
            <Text style={styles.readingLabel}>• Kun: <Text style={styles.readingVal}>{kanji.kunyomi.join(', ')}</Text></Text>
          </View>
        </View>
      </View>

      {/* Common Kanji Compounds */}
      {kanji.vocabCompounds && kanji.vocabCompounds.length > 0 && (
        <View style={styles.compoundsBox}>
          <Text style={styles.compoundsHeader}>TỪ GHÉP QUAN TRỌNG</Text>
          <View style={styles.compoundsList}>
            {kanji.vocabCompounds.map((comp, idx) => (
              <View key={idx} style={styles.compoundChip}>
                <Text style={styles.compoundExpr}>{comp.expression}</Text>
                <Text style={styles.compoundReading}>({comp.reading})</Text>
                <Text style={styles.compoundMeaning}>: {comp.meaningVi}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark.bgSurface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.dark.borderSubtle,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.dark.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  mainRow: {
    flexDirection: 'row',
    gap: 14,
  },
  canvasWrapper: {
    alignItems: 'center',
  },
  riceGrid: {
    width: 130,
    height: 130,
    backgroundColor: colors.dark.bgSubtle,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.dark.borderSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  gridLineHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  gridLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  gridLineDiagonal1: {
    position: 'absolute',
    width: 180,
    height: 1,
    transform: [{ rotate: '45deg' }],
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  gridLineDiagonal2: {
    position: 'absolute',
    width: 180,
    height: 1,
    transform: [{ rotate: '-45deg' }],
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  ghostKanji: {
    fontSize: 76,
    fontWeight: '300',
    color: 'rgba(255,255,255,0.22)',
  },
  hiddenGhost: {
    opacity: 0,
  },
  canvasActions: {
    marginTop: 8,
  },
  hintBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  hintBtnText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  infoWrapper: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  radicalsList: {
    gap: 4,
    marginBottom: 8,
  },
  radicalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.bgSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  radicalSymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent,
    width: 24,
  },
  radicalDetail: {
    flexDirection: 'row',
    gap: 4,
  },
  radicalName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dark.textPrimary,
  },
  radicalMeaning: {
    fontSize: 12,
    color: '#94A3B8',
  },
  mnemonicBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
    borderLeftWidth: 2.5,
    borderLeftColor: colors.warning,
  },
  mnemonicTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.warning,
    marginBottom: 2,
  },
  mnemonicText: {
    fontSize: 12,
    color: colors.dark.textSecondary,
    lineHeight: 16,
  },
  readingRow: {
    marginTop: 6,
  },
  readingLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginVertical: 1,
  },
  readingVal: {
    color: colors.dark.textPrimary,
    fontWeight: '600',
  },
  compoundsBox: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.dark.borderSubtle,
  },
  compoundsHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  compoundsList: {
    gap: 4,
  },
  compoundChip: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  compoundExpr: {
    fontSize: 13,
    fontWeight: '700',
    color: '#818CF8',
  },
  compoundReading: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 4,
  },
  compoundMeaning: {
    fontSize: 12,
    color: colors.dark.textSecondary,
  },
});
