import { TextStyle } from 'react-native';

export const typography = {
  // Japanese Font Stack & Sizes
  japanese: {
    furigana: {
      fontSize: 11,
      lineHeight: 14,
      fontWeight: '500' as TextStyle['fontWeight'],
    },
    characterLarge: {
      fontSize: 32,
      lineHeight: 44,
      fontWeight: '700' as TextStyle['fontWeight'],
    },
    characterMedium: {
      fontSize: 24,
      lineHeight: 36,
      fontWeight: '600' as TextStyle['fontWeight'],
    },
    characterBase: {
      fontSize: 18,
      lineHeight: 30,
      fontWeight: '500' as TextStyle['fontWeight'],
    },
    romaji: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400' as TextStyle['fontWeight'],
    },
  },

  // General UI Typography
  ui: {
    h1: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '800' as TextStyle['fontWeight'],
    },
    h2: {
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '700' as TextStyle['fontWeight'],
    },
    h3: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '600' as TextStyle['fontWeight'],
    },
    bodyLarge: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as TextStyle['fontWeight'],
    },
    body: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400' as TextStyle['fontWeight'],
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400' as TextStyle['fontWeight'],
    },
    badge: {
      fontSize: 11,
      lineHeight: 14,
      fontWeight: '700' as TextStyle['fontWeight'],
    },
  },
};
