/**
 * Định nghĩa kiểu dữ liệu cho hệ thống Design System.
 */

export type FontWeight = '400' | '500' | '600' | '700' | '800';
export type LetterSpacing = -0.5 | 0 | 0.5;

export interface TypographyConfig {
  size: number;
  weight: FontWeight;
  letterSpacing: LetterSpacing;
}

export interface ShadowConfig {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}
