import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  Dimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme/colors';
import { Card } from './Card';
import { Badge } from './Badge';
import { hapticService } from '../services/haptics/hapticService';
import { KanaCharacter } from '../data/kana/kanaData';

interface Point {
  x: number;
  y: number;
}

type Stroke = Point[];

interface CharacterWriteCardProps {
  character: KanaCharacter | {
    char: string;
    romaji: string;
    strokeCount?: number;
    mnemonic?: string;
    sampleWords?: { word: string; reading: string; meaningVi: string }[];
  };
  onClose?: () => void;
}

const CANVAS_SIZE = 260;

export const CharacterWriteCard: React.FC<CharacterWriteCardProps> = ({
  character,
  onClose,
}) => {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke>([]);
  const [showGhost, setShowGhost] = useState(true);

  const strokesRef = useRef<Stroke[]>([]);
  strokesRef.current = strokes;

  const currentStrokeRef = useRef<Stroke>([]);
  currentStrokeRef.current = currentStroke;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        hapticService.light();
        const { locationX, locationY } = evt.nativeEvent;
        const newPoint = { x: locationX, y: locationY };
        currentStrokeRef.current = [newPoint];
        setCurrentStroke([newPoint]);
      },
      onPanResponderMove: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        const newPoint = { x: locationX, y: locationY };
        currentStrokeRef.current = [...currentStrokeRef.current, newPoint];
        setCurrentStroke([...currentStrokeRef.current]);
      },
      onPanResponderRelease: () => {
        if (currentStrokeRef.current.length > 0) {
          const updated = [...strokesRef.current, currentStrokeRef.current];
          strokesRef.current = updated;
          setStrokes(updated);
          currentStrokeRef.current = [];
          setCurrentStroke([]);
        }
      },
    })
  ).current;

  const handleClear = () => {
    hapticService.medium();
    setStrokes([]);
    setCurrentStroke([]);
    strokesRef.current = [];
    currentStrokeRef.current = [];
  };

  const handleUndo = () => {
    if (strokes.length === 0) return;
    hapticService.light();
    const updated = strokes.slice(0, -1);
    setStrokes(updated);
    strokesRef.current = updated;
  };

  const toggleGhost = () => {
    hapticService.light();
    setShowGhost((prev) => !prev);
  };

  const strokeToPath = (points: Point[]): string => {
    if (points.length === 0) return '';
    if (points.length === 1) {
      return `M ${points[0].x} ${points[0].y} L ${points[0].x + 0.5} ${points[0].y + 0.5}`;
    }
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }
    return d;
  };

  return (
    <Card style={styles.card} variant="elevated">
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Badge label={`Số nét: ${character.strokeCount || 1}`} variant="purple" />
          <Text style={styles.charRomaji}>Phát âm: /{character.romaji}/</Text>
        </View>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕ Đóng</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Canvas Rice Grid */}
      <View style={styles.canvasContainer}>
        <View style={styles.riceGrid} {...panResponder.panHandlers}>
          {/* Rice Grid Guide Lines (Lưới chữ Mễ) */}
          <View style={styles.gridLineHorizontal} />
          <View style={styles.gridLineVertical} />
          <View style={styles.gridLineDiagonal1} />
          <View style={styles.gridLineDiagonal2} />

          {/* Ghost Guide Outline */}
          {showGhost && (
            <Text style={styles.ghostText} pointerEvents="none">
              {character.char}
            </Text>
          )}

          {/* SVG Drawing Layer */}
          <Svg style={StyleSheet.absoluteFill}>
            {strokes.map((stroke, idx) => (
              <Path
                key={idx}
                d={strokeToPath(stroke)}
                stroke={colors.accent}
                strokeWidth={7}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            ))}
            {currentStroke.length > 0 && (
              <Path
                d={strokeToPath(currentStroke)}
                stroke={colors.accent}
                strokeWidth={7}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            )}
          </Svg>
        </View>
      </View>

      {/* Canvas Tool Buttons */}
      <View style={styles.toolsRow}>
        <TouchableOpacity style={styles.toolBtn} onPress={toggleGhost}>
          <Text style={styles.toolBtnText}>{showGhost ? '👁️ Ẩn nét mờ' : '👁️ Hiện nét mờ'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolBtn, strokes.length === 0 && styles.toolBtnDisabled]}
          onPress={handleUndo}
          disabled={strokes.length === 0}
        >
          <Text style={styles.toolBtnText}>↩ Hoàn tác</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolBtn, strokes.length === 0 && styles.toolBtnDisabled]}
          onPress={handleClear}
          disabled={strokes.length === 0}
        >
          <Text style={styles.toolBtnText}>🗑️ Xóa nét</Text>
        </TouchableOpacity>
      </View>

      {/* Stroke counter feedback */}
      <View style={styles.strokeCountBanner}>
        <Text style={styles.strokeCountText}>
          ✍️ Bạn đã viết: <Text style={styles.strokeCountBold}>{strokes.length}</Text> / {character.strokeCount || 1} nét
        </Text>
      </View>

      {/* Mnemonic Memory Trick */}
      {character.mnemonic && (
        <View style={styles.mnemonicBox}>
          <Text style={styles.mnemonicTitle}>💡 MẸO GHI NHỚ MẶT CHỮ:</Text>
          <Text style={styles.mnemonicText}>{character.mnemonic}</Text>
        </View>
      )}

      {/* Sample Words */}
      {character.sampleWords && character.sampleWords.length > 0 && (
        <View style={styles.wordsBox}>
          <Text style={styles.wordsTitle}>TỪ VỰNG VÍ DỤ:</Text>
          <View style={styles.wordsList}>
            {character.sampleWords.map((sw, idx) => (
              <View key={idx} style={styles.wordChip}>
                <Text style={styles.wordJapanese}>{sw.word}</Text>
                <Text style={styles.wordReading}>({sw.reading})</Text>
                <Text style={styles.wordMeaning}>: {sw.meaningVi}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.dark.bgSurface,
    borderWidth: 1,
    borderColor: colors.dark.borderSubtle,
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  charRomaji: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
  },
  closeBtn: {
    backgroundColor: colors.dark.bgSubtle,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  closeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.dark.textSecondary,
  },
  canvasContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  riceGrid: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridLineHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: CANVAS_SIZE / 2,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  gridLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: CANVAS_SIZE / 2,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  gridLineDiagonal1: {
    position: 'absolute',
    width: CANVAS_SIZE * 1.414,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    transform: [{ rotate: '45deg' }],
  },
  gridLineDiagonal2: {
    position: 'absolute',
    width: CANVAS_SIZE * 1.414,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    transform: [{ rotate: '-45deg' }],
  },
  ghostText: {
    position: 'absolute',
    fontSize: CANVAS_SIZE * 0.72,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.12)',
    textAlign: 'center',
    userSelect: 'none',
  },
  toolsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 14,
  },
  toolBtn: {
    backgroundColor: colors.dark.bgSubtle,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  toolBtnDisabled: {
    opacity: 0.4,
  },
  toolBtnText: {
    color: colors.dark.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  strokeCountBanner: {
    alignItems: 'center',
    marginTop: 10,
  },
  strokeCountText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  strokeCountBold: {
    color: colors.accent,
    fontWeight: '800',
  },
  mnemonicBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  mnemonicTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.warning,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  mnemonicText: {
    fontSize: 13,
    color: colors.dark.textPrimary,
    lineHeight: 19,
  },
  wordsBox: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.dark.borderSubtle,
  },
  wordsTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  wordsList: {
    gap: 6,
  },
  wordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  wordJapanese: {
    fontSize: 14,
    fontWeight: '800',
    color: '#818CF8',
  },
  wordReading: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 4,
  },
  wordMeaning: {
    fontSize: 13,
    color: colors.dark.textSecondary,
  },
});

