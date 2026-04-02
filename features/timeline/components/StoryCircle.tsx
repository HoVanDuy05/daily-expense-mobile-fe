import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/common/AppText';
import { AppAvatar } from '@/components/common/AppAvatar';
import { Colors, Spacing } from '@/constants/Theme';

interface StoryCircleProps {
  id: string;
  name: string;
  avatar: string;
  onPress?: () => void;
  isAdd?: boolean;
}

/**
 * Component hiển thị story (vòng tròn avatar) phong cách Locket/Instagram.
 * Tái sử dụng Theme và AppAvatar.
 */
export const StoryCircle = ({ 
  name, 
  avatar, 
  onPress, 
  isAdd = false 
}: StoryCircleProps) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <AppAvatar 
        uri={avatar} 
        storyRing={!isAdd} 
        size={66} 
        style={isAdd ? styles.addBorder : undefined}
      />
      <AppText 
        variant="caption" 
        weight="medium" 
        align="center"
        numberOfLines={1} 
        style={styles.name}
      >
        {name}
      </AppText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 70,
    marginRight: Spacing.md,
  },
  addBorder: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 33,
    borderStyle: 'dashed',
  },
  name: {
    marginTop: 6,
    width: '100%',
  },
});
