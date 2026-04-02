import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants/Theme';
import { AppText } from '@/components/common/AppText';
import { AppAvatar } from '@/components/common/AppAvatar';
import { ChatThread } from '@/types/Chat';

interface ChatItemProps extends ChatThread {
  onPress: () => void;
}

/**
 * Component hiển thị một cuộc trò truyện trong danh sách Inbox.
 * Tái sử dụng Theme, Types và các Shared Components.
 */
export const ChatItem = ({ 
  name, 
  msg, 
  time, 
  unread, 
  online, 
  avatar, 
  onPress 
}: ChatItemProps) => {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <AppAvatar uri={avatar} online={online} size={62} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <AppText weight="bold" style={styles.name} numberOfLines={1}>
            {name}
          </AppText>
          <AppText 
            variant="caption" 
            color={unread > 0 ? Colors.primary : Colors.text.secondary}
            weight={unread > 0 ? 'bold' : 'regular'}
          >
            {time}
          </AppText>
        </View>
        
        <View style={styles.footer}>
          <AppText 
            variant="subtext" 
            color={unread > 0 ? Colors.text.primary : Colors.text.secondary}
            weight={unread > 0 ? 'semibold' : 'regular'}
            numberOfLines={1}
            style={styles.msg}
          >
            {msg}
          </AppText>
          {unread > 0 && (
            <View style={styles.unreadBadge}>
              <AppText 
                variant="tiny" 
                weight="bold" 
                color={Colors.white}
              >
                {unread > 9 ? '9+' : unread}
              </AppText>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    marginLeft: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  msg: {
    flex: 1,
    paddingRight: 10,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    marginLeft: 8,
  },
});
