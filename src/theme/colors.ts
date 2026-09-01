export type ThemeMode = 'light' | 'dark';

export interface AppTheme {
  mode: ThemeMode;
  bgCanvas: string;
  bgSurface: string;
  bgSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  borderSubtle: string;
  cardShadow: string;
  accent: string;
  accentBg: string;
  primary: string;
  success: string;
  warning: string;
  danger: string;
}

export const THEMES: Record<ThemeMode, AppTheme> = {
  dark: {
    mode: 'dark',
    bgCanvas: '#0B0F17',
    bgSurface: '#151D2A',
    bgSubtle: '#1E293B',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    borderSubtle: '#243044',
    cardShadow: 'rgba(0, 0, 0, 0.4)',
    accent: '#F43F5E',       // Đỏ hoa anh đào Sakura
    accentBg: 'rgba(244, 63, 94, 0.12)',
    primary: '#1E293B',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
  light: {
    mode: 'light',
    bgCanvas: '#FAF8F5',     // Nền kem sữa ấm Washi dịu mắt (chống lóa)
    bgSurface: '#FFFFFF',    // Trắng ngà nổi trên nền kem
    bgSubtle: '#F4EFE6',     // Vàng kem nhạt êm dịu
    textPrimary: '#1C1917',  // Đen than ấm dịu, độ tương phản chuẩn WCAG AAA
    textSecondary: '#78716C',// Nâu xám ấm nhẹ nhàng
    textTertiary: '#A8A29E',
    borderSubtle: '#E7E0D3', // Viền cát vàng thanh lịch
    cardShadow: 'rgba(180, 83, 9, 0.06)',
    accent: '#D97706',       // Vàng hổ phách Amber / Mật ong ấm áp (không chói gắt)
    accentBg: 'rgba(217, 119, 6, 0.12)',
    primary: '#D97706',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
};

export function getTheme(mode: ThemeMode = 'dark'): AppTheme {
  return THEMES[mode] || THEMES.dark;
}

export const colors = {
  // Brand & Accent Colors
  primary: '#1E293B',
  primaryDark: '#0F172A',
  accent: '#F43F5E',
  success: '#10B981',
  successDark: '#065F46',
  warning: '#F59E0B',
  danger: '#EF4444',
  dangerDark: '#DC2626',

  // Pitch Accent Colors
  pitchHigh: '#E11D48',
  pitchLow: '#0284C7',

  // JLPT Badges
  jlpt: {
    intro: '#A855F7',
    n5: '#22C55E',
    n4: '#14B8A6',
    n3: '#F59E0B',
    n2: '#6366F1',
  },

  // SRS Rating Colors
  srs: {
    again: '#EF4444',
    hard: '#F59E0B',
    good: '#10B981',
    easy: '#6366F1',
  },

  // Theme Modes (Tương thích ngược)
  light: THEMES.light,
  dark: THEMES.dark,
};
