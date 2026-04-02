/**
 * Hệ thống thiết kế chuẩn (Design System) phiên bản Premium.
 * Sử dụng font Outfit và bảng màu Hiện đại (Slate & Indigo).
 */

export const Colors = {
  // Brand colors - Modern Violet
  primary: '#7C3AED',
  primaryLight: '#F5F3FF',
  primaryGradient: ['#7C3AED', '#A78BFA'] as const,

  // Secondary colors - Modern Rose
  accent: '#F43F5E',
  accentLight: '#FFF1F2',

  // Neutral - Slate Grays
  background: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceDark: '#F1F5F9',
  white: '#FFFFFF',
  black: '#0F172A',

  // Text colors - Slate
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
    muted: '#94A3B8',
    onPrimary: '#FFFFFF',
  },

  // Utility
  online: '#10B981',
  error: '#EF4444',
  border: '#E2E8F0',
  shadow: '#0F172A',
};

export const Spacing = {
  zero: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Typography = {
  // Font Family - Modern Be Vietnam Pro
  fonts: {
    regular: 'BeVietnamPro_400Regular',
    medium: 'BeVietnamPro_500Medium',
    semibold: 'BeVietnamPro_600SemiBold',
    bold: 'BeVietnamPro_700Bold',
    heavy: 'BeVietnamPro_800ExtraBold',
    black: 'BeVietnamPro_900Black',
  },
  // Sizes
  sizes: {
    h1: 18,
    h2: 16,
    h3: 14,
    body: 12,
    subtext: 10,
    caption: 9,
    tiny: 8,
  },
  // Weights (Fallback if font not loaded)
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
    black: '900' as const,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  }
};

export const Borders = {
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    full: 9999,
  },
  width: {
    thin: 0.5,
    base: 1,
    thick: 2,
  }
};

export const Shadows = {
  light: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  heavy: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  }
};
