import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Borders } from '@/constants/Theme';
import { AppText } from '@/components/common/AppText';
import { AppAvatar } from '@/components/common/AppAvatar';

interface MessageBubbleProps {
  id: string;
  text: string;
  sender: 'me' | 'them';
  time: string;
  isLast?: boolean;
}

/**
 * Component hiển thị bong bóng chat phong cách Messenger.
 * Tự động căn lề và đổi màu dựa trên người gửi.
 */
export const MessageBubble = ({ 
  text, 
  sender, 
  isLast 
}: MessageBubbleProps) => {
  const isMe = sender === 'me';

  return (
    <View style={[styles.row, isMe ? styles.myRow : styles.theirRow]}>
      {!isMe && (
        <AppAvatar uri="https://i.pravatar.cc/150?u=linh" size={28} style={styles.avatarSmall} />
      )}
      <View style={styles.bubbleContainer}>
        {isMe ? (
          <LinearGradient
            colors={Colors.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bubbleMe}
          >
            <AppText color={Colors.white} weight="medium">{text}</AppText>
          </LinearGradient>
        ) : (
          <View style={styles.bubbleThem}>
            <AppText>{text}</AppText>
          </View>
        )}
        {isLast && isMe && (
          <AppText variant="tiny" color={Colors.text.muted} style={styles.seenStatus}>
            Đã xem
          </AppText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'flex-end',
  },
  myRow: {
    justifyContent: 'flex-end',
  },
  theirRow: {
    justifyContent: 'flex-start',
  },
  avatarSmall: {
    marginRight: Spacing.sm,
    marginBottom: 4,
  },
  bubbleContainer: {
    maxWidth: '75%',
  },
  bubbleMe: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Borders.radius.xl,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: Colors.surfaceDark,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Borders.radius.xl,
    borderBottomLeftRadius: 4,
  },
  seenStatus: {
    alignSelf: 'flex-end',
    marginTop: 2,
    marginRight: 4,
  },
});
