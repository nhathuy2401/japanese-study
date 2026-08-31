import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DomainGrammarPoint } from '../domain/entities/types';
import { colors } from '../theme/colors';
import { Badge } from './Badge';
import { useAiStore } from '../stores/StoreContext';

interface GrammarBlockProps {
  grammar: DomainGrammarPoint;
}

export const GrammarBlock: React.FC<GrammarBlockProps> = ({ grammar }) => {
  const aiStore = useAiStore();

  const handleAskAi = () => {
    aiStore.requestGrammarExplanation(grammar.pattern, grammar.levelId.toUpperCase());
  };

  return (
    <View style={styles.container}>
      {/* Header: Pattern + Meaning */}
      <View style={styles.header}>
        <View style={styles.titleArea}>
          <Text style={styles.patternText}>{grammar.pattern}</Text>
          <Text style={styles.meaningText}>{grammar.meaningVi}</Text>
        </View>
        <TouchableOpacity style={styles.aiButton} onPress={handleAskAi}>
          <Text style={styles.aiButtonText}>✨ Hỏi AI</Text>
        </TouchableOpacity>
      </View>

      {/* Nuance Badges */}
      <View style={styles.badgeRow}>
        {grammar.nuanceBadges.map((badge, idx) => (
          <Badge
            key={idx}
            label={badge.label}
            variant={badge.type === 'warning' ? 'danger' : badge.type === 'polite' ? 'primary' : 'success'}
            style={styles.badgeItem}
          />
        ))}
      </View>

      {/* Lego-style Formation Rules */}
      <View style={styles.formationBox}>
        <Text style={styles.sectionLabel}>CÔNG THỨC KẾT NỐI (FORMATION)</Text>
        <View style={styles.legoGrid}>
          {grammar.formation.map((rule, idx) => (
            <View key={idx} style={styles.legoCard}>
              <View style={styles.legoPill}>
                <Text style={styles.legoPillText}>{rule.component}</Text>
              </View>
              <Text style={styles.legoExplanation}>{rule.explanationVi}</Text>
              <Text style={styles.legoExample}>Ví dụ: {rule.example}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Common Mistakes Alert for Vietnamese Learners */}
      {grammar.commonMistakes && grammar.commonMistakes.length > 0 && (
        <View style={styles.mistakeBox}>
          <Text style={styles.mistakeHeader}>⚠️ LỖI NGƯỜI VIỆT THƯỜNG GẶP</Text>
          {grammar.commonMistakes.map((mistake, idx) => (
            <Text key={idx} style={styles.mistakeText}>
              • {mistake}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark.bgSurface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.dark.borderSubtle,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleArea: {
    flex: 1,
    marginRight: 10,
  },
  patternText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#818CF8',
    marginBottom: 4,
  },
  meaningText: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    lineHeight: 20,
  },
  aiButton: {
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  aiButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 12,
  },
  badgeItem: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  formationBox: {
    backgroundColor: colors.dark.bgSubtle,
    borderRadius: 14,
    padding: 14,
    marginVertical: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  legoGrid: {
    gap: 10,
  },
  legoCard: {
    backgroundColor: colors.dark.bgSurface,
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  legoPill: {
    backgroundColor: 'rgba(99, 102, 241, 0.18)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  legoPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#818CF8',
  },
  legoExplanation: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    marginBottom: 4,
  },
  legoExample: {
    fontSize: 12,
    color: colors.dark.textPrimary,
    fontStyle: 'italic',
  },
  mistakeBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.danger,
  },
  mistakeHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.danger,
    marginBottom: 6,
  },
  mistakeText: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
});
