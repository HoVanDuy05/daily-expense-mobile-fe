import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Info, Phone, Video, Plus, Camera, Mic, Send, Smile } from 'lucide-react-native';
import { Image } from 'expo-image';

import { Colors, Spacing, Typography, Borders } from '@/constants/Theme';
import { AppText } from '@/components/common/AppText';
import { AppAvatar } from '@/components/common/AppAvatar';
import { MessageBubble } from '@/features/chat/components/MessageBubble';
import { useChat } from '@/features/chat/hooks/useChat';

/**
 * Màn hình Chat chi tiết.
 * Theo phong cách Facebook Messenger với dải màu Gradient rực rỡ.
 */
export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { message, setMessage, messages, sendMessage, flatListRef } = useChat();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header chuẩn Messenger */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={28} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.friendInfo}>
            <AppAvatar uri="https://i.pravatar.cc/150?u=linh" size={40} />
            <View style={styles.friendText}>
              <AppText variant="h3" weight="bold">Linh Nguyễn</AppText>
              <AppText variant="caption" color={Colors.text.secondary}>Đang hoạt động</AppText>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}><Phone size={22} color={Colors.primary} /></TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}><Video size={22} color={Colors.primary} /></TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}><Info size={22} color={Colors.primary} /></TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <MessageBubble {...item} isLast={index === messages.length - 1} />
          )}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={[styles.inputArea, { paddingBottom: Math.max(insets.bottom, 10) }]}>
          <View style={styles.inputLeftIcons}>
            <TouchableOpacity><Plus size={24} color={Colors.primary} /></TouchableOpacity>
            <TouchableOpacity><Camera size={24} color={Colors.primary} /></TouchableOpacity>
            <TouchableOpacity><Image source={{ uri: 'https://i.pravatar.cc/150?u=gallery' }} style={styles.galleryPreview} /></TouchableOpacity>
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nhắn tin..."
              placeholderTextColor={Colors.text.muted}
              multiline
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity><Smile size={24} color={Colors.primary} /> </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={sendMessage}
            activeOpacity={0.7}
          >
            {message ? (
              <Send size={24} color={Colors.primary} />
            ) : (
              <Mic size={24} color={Colors.primary} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backBtn: {
    marginRight: 4,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendText: {
    marginLeft: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    padding: 8,
  },
  messageList: {
    paddingBottom: 20,
    paddingHorizontal: 12,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.white,
  },
  inputLeftIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginRight: 8,
  },
  galleryPreview: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Borders.radius.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    minHeight: 40,
    color: Colors.text.primary,
    maxHeight: 120,
    marginRight: 8,
  },
  sendButton: {
    padding: 8,
    marginLeft: 4,
  },
});
