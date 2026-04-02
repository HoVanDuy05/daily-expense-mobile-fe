import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, ChevronLeft, MessageCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { Colors, Spacing, Typography, Borders } from '@/constants/Theme';
import { ROUTES } from '@/constants/Routes';
import { AppText } from '@/components/common/AppText';
import { ChatItem } from '@/features/chat/components/ChatItem';
import { useInbox } from '@/features/chat/hooks/useInbox';

/**
 * MÀN HÌNH DANH SÁCH TIN NHẮN
 */
export default function MessageListScreen() {
  const router = useRouter();
  const { search, setSearch, chats } = useInbox();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      
      <View style={[styles.header, { paddingTop: Math.max(insets.top, Spacing.md) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.black} />
        </TouchableOpacity>
        <AppText variant="h2" weight="bold">Tin nhắn</AppText>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color={Colors.text.muted} style={styles.searchIcon} />
          <TextInput
            placeholder="Tìm kiếm..."
            placeholderTextColor={Colors.text.muted}
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatItem 
            {...item} 
            onPress={() => router.push(ROUTES.CHAT.DETAILS(item.id))} 
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  searchBar: {
    height: 44,
    backgroundColor: Colors.surface,
    borderRadius: Borders.radius.xxl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginLeft: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    marginLeft: 8,
    color: Colors.text.primary,
  },
  listContent: {
    paddingBottom: 20,
  },
});
