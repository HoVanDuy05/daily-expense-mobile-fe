import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Borders, Spacing, Typography } from '@/constants/Theme';
import { AppText } from './AppText';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

/**
 * Component Button chuẩn hóa.
 * Tái sử dụng Theme tokens cho màu sắc và bo góc.
 */
export const AppButton = ({ 
  label, 
  onPress, 
  variant = 'primary', 
  loading = false, 
  disabled = false,
  style 
}: AppButtonProps) => {
  const getStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: Colors.primary,
          text: Colors.white,
          border: 'transparent'
        };
      case 'secondary':
        return {
          bg: Colors.primaryLight,
          text: Colors.primary,
          border: 'transparent'
        };
      case 'outline':
        return {
          bg: 'transparent',
          text: Colors.primary,
          border: Colors.primary
        };
      case 'ghost':
        return {
          bg: 'transparent',
          text: Colors.text.primary,
          border: 'transparent'
        };
    }
  };

  const themeStyles = getStyles();

  return (
    <TouchableOpacity 
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.base,
        {
          backgroundColor: themeStyles.bg,
          borderColor: themeStyles.border,
          borderWidth: variant === 'outline' ? 1 : 0,
          opacity: disabled ? 0.5 : 1,
        },
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={themeStyles.text} />
      ) : (
        <AppText 
          weight="bold" 
          color={themeStyles.text}
          style={{ fontSize: 16 }}
        >
          {label}
        </AppText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: Borders.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  }
});
