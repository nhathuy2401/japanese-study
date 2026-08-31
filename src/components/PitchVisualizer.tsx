import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PitchPattern } from '../domain/entities/types';
import { colors } from '../theme/colors';

interface PitchVisualizerProps {
  pattern: PitchPattern;
}

export const PitchVisualizer: React.FC<PitchVisualizerProps> = ({ pattern }) => {
  const getPitchTypeName = (type: string, pitchNum: number) => {
    switch (type) {
      case 'heiban':
        return `[${pitchNum}] Heiban (Bằng phẳng: Thấp ➔ Cao đều)`;
      case 'atamadaka':
        return `[${pitchNum}] Atamadaka (Cao đầu: Cao ➔ Thấp)`;
      case 'nakadaka':
        return `[${pitchNum}] Nakadaka (Cao giữa: Thấp ➔ Cao ➔ Thấp)`;
      case 'odaka':
        return `[${pitchNum}] Odaka (Cao đuôi: Thấp ➔ Cao ➔ Rơi ở trợ từ)`;
      default:
        return `[${pitchNum}] Pitch Accent`;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pitchTypeHeader}>
        {getPitchTypeName(pattern.type, pattern.pitchNumber)}
      </Text>

      {/* Mora Nodes & Stepped Line Graph */}
      <View style={styles.graphContainer}>
        {/* High Pitch Level */}
        <View style={styles.levelRow}>
          <Text style={[styles.levelLabel, { color: colors.pitchHigh }]}>H (Cao)</Text>
          <View style={styles.moraTrack}>
            {pattern.moras.map((m, idx) => (
              <View key={`high-${idx}`} style={styles.moraSlot}>
                {m.isHigh && (
                  <View style={[styles.dot, { backgroundColor: colors.pitchHigh }]}>
                    <Text style={styles.dotText}>▲</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Mid connector guide line */}
        <View style={styles.guideLine} />

        {/* Low Pitch Level */}
        <View style={styles.levelRow}>
          <Text style={[styles.levelLabel, { color: colors.pitchLow }]}>L (Thấp)</Text>
          <View style={styles.moraTrack}>
            {pattern.moras.map((m, idx) => (
              <View key={`low-${idx}`} style={styles.moraSlot}>
                {!m.isHigh && (
                  <View style={[styles.dot, { backgroundColor: colors.pitchLow }]}>
                    <Text style={styles.dotText}>▼</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Mora character labels below */}
        <View style={styles.moraLabelRow}>
          <Text style={styles.levelLabel}>Mora</Text>
          <View style={styles.moraTrack}>
            {pattern.moras.map((m, idx) => (
              <View key={`label-${idx}`} style={styles.moraSlot}>
                <Text style={styles.moraChar}>{m.mora}</Text>
                <Text style={styles.moraIndex}>({idx + 1})</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark.bgSubtle,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  pitchTypeHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#818CF8',
    marginBottom: 10,
  },
  graphContainer: {
    paddingVertical: 6,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
  },
  levelLabel: {
    width: 60,
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  moraTrack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  moraSlot: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  guideLine: {
    height: 1,
    backgroundColor: colors.dark.borderSubtle,
    marginLeft: 60,
    marginVertical: 2,
  },
  moraLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.dark.borderSubtle,
  },
  moraChar: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },
  moraIndex: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 1,
  },
});

