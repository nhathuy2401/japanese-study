export const colors = {
  // Brand & Accent Colors
  primary: '#1E293B',       // Indigo Deep
  primaryDark: '#0F172A',
  accent: '#F43F5E',        // Sakura Accent
  success: '#10B981',       // Bamboo Green
  successDark: '#065F46',   // Matcha Dark
  warning: '#F59E0B',       // Amber
  danger: '#EF4444',        // Crimson Red
  dangerDark: '#DC2626',

  // Pitch Accent Colors
  pitchHigh: '#E11D48',     // Crimson Red
  pitchLow: '#0284C7',      // Ocean Blue

  // JLPT Badges
  jlpt: {
    intro: '#A855F7',       // Purple
    n5: '#22C55E',          // Green
    n4: '#14B8A6',          // Teal
    n3: '#F59E0B',          // Amber
    n2: '#6366F1',          // Indigo
  },

  // SRS Rating Colors
  srs: {
    again: '#EF4444',       // Red
    hard: '#F59E0B',        // Orange
    good: '#10B981',        // Green
    easy: '#6366F1',        // Blue/Indigo
  },

  // Theme Modes
  light: {
    bgCanvas: '#F8FAFC',
    bgSurface: '#FFFFFF',
    bgSubtle: '#F1F5F9',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textTertiary: '#94A3B8',
    borderSubtle: '#E2E8F0',
    cardShadow: 'rgba(15, 23, 42, 0.06)',
  },
  dark: {
    bgCanvas: '#0B0F17',
    bgSurface: '#151D2A',
    bgSubtle: '#1E293B',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    borderSubtle: '#243044',
    cardShadow: 'rgba(0, 0, 0, 0.4)',
  },
};

export type ThemeMode = 'light' | 'dark';
