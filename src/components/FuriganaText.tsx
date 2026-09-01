import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { observer } from 'mobx-react-lite';
import { parseFurigana, FuriganaSegment } from '../utils/furiganaHelper';
import { useSettingsStore } from '../stores/StoreContext';
import { colors } from '../theme/colors';

export interface FuriganaTextProps {
  text?: string;
  segments?: FuriganaSegment[];
  fontSize?: number;
  furiganaFontSize?: number;
  color?: string;
  furiganaColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  forceShow?: boolean;
  onPressSegment?: (segment: FuriganaSegment) => void;
}

export const FuriganaText: React.FC<FuriganaTextProps> = observer(({
  text = '',
  segments: propSegments,
  fontSize = 18,
  furiganaFontSize = 10,
  color = colors.dark.textPrimary,
  furiganaColor = '#94A3B8',
  style,
  textStyle,
  forceShow = false,
  onPressSegment,
}) => {
  const settings = useSettingsStore();
  const [revealedIndices, setRevealedIndices] = useState<Record<number, boolean>>({});

  const segments = propSegments || parseFurigana(text);

  const shouldShowFurigana = (idx: number, segment: FuriganaSegment): boolean => {
    if (!segment.furigana) return false;
    if (forceShow) return true;
    if (settings.furiganaMode === 'always') return true;
    if (settings.furiganaMode === 'tap-to-reveal') {
      return !!revealedIndices[idx];
    }
    return false; // 'hidden' mode
  };

  const handlePress = (idx: number, segment: FuriganaSegment) => {
    if (settings.furiganaMode === 'tap-to-reveal' && segment.furigana) {
      setRevealedIndices((prev) => ({ ...prev, [idx]: !prev[idx] }));
    }
    if (onPressSegment) {
      onPressSegment(segment);
    }
  };

  // Chiều cao dòng Furigana tỷ lệ theo font size
  const furiganaHeight = Math.max(12, Math.round(furiganaFontSize * 1.3));

  return (
    <View style={[styles.container, style]}>
      {segments.map((seg, idx) => {
        const showFuri = shouldShowFurigana(idx, seg);
        const hasFurigana = seg.isKanji && !!seg.furigana;

        if (hasFurigana) {
          return (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.7}
              onPress={() => handlePress(idx, seg)}
              style={styles.rubyColumn}
            >
              {/* Hàng hiển thị Furigana trên đầu chữ Kanji */}
              <View style={[styles.furiganaRow, { height: furiganaHeight }]}>
                {showFuri ? (
                  <Text
                    style={[
                      styles.furiganaText,
                      {
                        fontSize: furiganaFontSize,
                        color: furiganaColor,
                      },
                    ]}
                  >
                    {seg.furigana}
                  </Text>
                ) : settings.furiganaMode === 'tap-to-reveal' && !forceShow ? (
                  <Text style={[styles.maskedFurigana, { fontSize: furiganaFontSize * 0.9 }]}>
                    •
                  </Text>
                ) : (
                  <Text style={{ fontSize: furiganaFontSize, opacity: 0 }}> </Text>
                )}
              </View>

              {/* Chữ Kanji bên dưới */}
              <Text
                style={[
                  styles.kanjiText,
                  {
                    fontSize: fontSize,
                    color: color,
                  },
                  textStyle,
                ]}
              >
                {seg.text}
              </Text>
            </TouchableOpacity>
          );
        }

        // Ký tự Kana hoặc dấu câu: canh đáy thẳng hàng với chữ Kanji
        return (
          <View key={idx} style={styles.kanaColumn}>
            <View style={{ height: furiganaHeight }} />
            <Text
              style={[
                styles.kanaText,
                {
                  fontSize: fontSize,
                  color: color,
                },
                textStyle,
              ]}
            >
              {seg.text}
            </Text>
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    rowGap: 4,
  },
  rubyColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 1,
  },
  furiganaRow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  furiganaText: {
    fontWeight: '600',
    textAlign: 'center',
    includeFontPadding: false,
  },
  maskedFurigana: {
    color: '#64748B',
    textAlign: 'center',
  },
  kanjiText: {
    fontWeight: '600',
    textAlign: 'center',
    includeFontPadding: false,
  },
  kanaColumn: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  kanaText: {
    fontWeight: '400',
    includeFontPadding: false,
  },
});

