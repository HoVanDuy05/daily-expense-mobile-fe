import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { Typography, Colors } from '@/constants/Theme';

interface AppTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'subtext' | 'caption' | 'tiny';
  weight?: keyof typeof Typography.weights;
  color?: string;
  align?: 'left' | 'center' | 'right';
  font?: keyof typeof Typography.fonts;
}

/**
 * Component Text chuẩn hóa của ứng dụng.
 * Tự động áp dụng Font Family hiện đại (Outfit), Font Size, Weight và Color.
 */
export const AppText = ({ 
  children, 
  variant = 'body', 
  weight = 'regular', 
  color,
  align = 'left',
  font,
  style, 
  ...props 
}: AppTextProps) => {
  const fontFamily = font ? Typography.fonts[font] : Typography.fonts[weight as keyof typeof Typography.fonts] || Typography.fonts.regular;

  const isTitle = ['h1', 'h2', 'h3'].includes(variant);
  const finalColor = color || (isTitle ? Colors.primary : Colors.text.primary);

  return (
    <Text 
      style={[
        {
          fontFamily: fontFamily,
          fontSize: Typography.sizes[variant],
          color: finalColor,
          textAlign: align,
          letterSpacing: Typography.letterSpacing.tight,
        },
        style
      ]} 
      {...props}
    >
      {children}
    </Text>
  );
};
