import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Borders } from '@/constants/Theme';

interface AppAvatarProps {
  uri: string;
  size?: number;
  online?: boolean;
  storyRing?: boolean;
  style?: ViewStyle;
}

/**
 * Component Avatar đa năng với hiệu ứng Story rực rỡ và badge online.
 * Hỗ trợ các kích thước và kiểu dáng khác nhau.
 */
export const AppAvatar = ({ 
  uri, 
  size = 60, 
  online = false, 
  storyRing = false, 
  style 
}: AppAvatarProps) => {
  const avatarSize = storyRing ? size - 6 : size;

  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      {storyRing ? (
        <LinearGradient
          colors={['#FF4500', '#FF8C00', '#FFD700']}
          style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }]}
        >
          <Image 
            source={{ uri }} 
            style={[styles.avatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2, borderWidth: 2, borderColor: Colors.white }]} 
            contentFit="cover"
            transition={300}
          />
        </LinearGradient>
      ) : (
        <Image 
          source={{ uri }} 
          style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]} 
          contentFit="cover"
          transition={300}
        />
      )}
      
      {online && (
        <View style={[styles.onlineBadge, { bottom: size * 0.05, right: size * 0.05 }]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ring: {
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    backgroundColor: Colors.surface,
  },
  onlineBadge: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.online,
    borderWidth: 2,
    borderColor: Colors.white,
  }
});
