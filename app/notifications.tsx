import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, RefreshControl, ActivityIndicator } from 'react-native';
import { Bell, Heart, UserPlus, Zap, ArrowLeft, MoreHorizontal } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import apiClient from '@/services/api';

import { Colors, Spacing, Shadows, Borders } from '@/constants/Theme';
import { AppText } from '@/components/common/AppText';
import { AppAvatar } from '@/components/common/AppAvatar';

import { Skeleton } from '@/components/common/Skeleton';

const NotiSkeleton = () => (
  <View style={{ flex: 1, backgroundColor: Colors.white, padding: 20 }}>
    {[1, 2, 3, 4, 5].map(i => (
      <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <Skeleton width={50} height={50} borderRadius={25} />
        <View style={{ marginLeft: 15, flex: 1 }}>
          <Skeleton width="60%" height={16} style={{ marginBottom: 8 }} />
          <Skeleton width="40%" height={12} />
        </View>
      </View>
    ))}
  </View>
);

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await apiClient.get('/notifications');
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Lỗi tải thông báo:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const markRead = async (id: string) => {
    try {
      await apiClient.post(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date() } : n));
    } catch {}
  };

  const renderNotiIcon = (type: string) => {
    switch (type) {
       case 'App\\Notifications\\FriendRequestNotification':
          return <View style={[styles.notiIcon, { backgroundColor: '#3B82F6' }]}><UserPlus size={14} color="#FFF" /></View>;
       default:
          return <View style={[styles.notiIcon, { backgroundColor: Colors.primary }]}><Bell size={14} color="#FFF" /></View>;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
         <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={24} color={Colors.black} />
         </TouchableOpacity>
         <AppText variant="h2" weight="heavy">Thông báo</AppText>
         <TouchableOpacity>
            <MoreHorizontal size={24} color={Colors.black} />
         </TouchableOpacity>
      </View>

      {loading ? (
        <NotiSkeleton />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <TouchableOpacity 
               style={[styles.notiItem, !item.read_at && styles.unreadNoti]}
               onPress={() => markRead(item.id)}
            >
               <View style={styles.avatarWrapper}>
                  <AppAvatar uri={item.data.sender_avatar} size={50} />
                  <View style={styles.iconOverlay}>
                     {renderNotiIcon(item.type)}
                  </View>
               </View>
               <View style={styles.notiInfo}>
                  <AppText weight={item.read_at ? "semibold" : "bold"} style={styles.notiTitle}>
                     {item.data.title}
                  </AppText>
                  <AppText variant="caption" color={Colors.text.secondary} numberOfLines={2}>
                     {item.data.message}
                  </AppText>
                  <AppText variant="tiny" color={Colors.text.muted} style={{ marginTop: 4 }}>
                     {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(item.created_at).toLocaleDateString()}
                  </AppText>
               </View>
               {!item.read_at && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
               <View style={styles.emptyIconCircle}>
                  <Bell size={40} color={Colors.text.muted} />
               </View>
               <AppText weight="bold" color={Colors.text.primary}>Không có thông báo mới</AppText>
               <AppText variant="caption" color={Colors.text.muted} align="center">Chúng tôi sẽ báo cho bạn khi có biến động kết bạn hoặc chi tiêu!</AppText>
            </View>
          }
        />
      )}
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 40,
  },
  notiItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.03)',
  },
  unreadNoti: {
    backgroundColor: 'rgba(124, 58, 237, 0.03)',
  },
  avatarWrapper: {
    position: 'relative',
  },
  iconOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
  },
  notiIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notiInfo: {
    flex: 1,
    marginLeft: 16,
  },
  notiTitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginLeft: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyWrap: {
    marginTop: 100,
    alignItems: 'center',
    paddingHorizontal: 60,
  },
  emptyIconCircle: {
     width: 80,
     height: 80,
     borderRadius: 40,
     backgroundColor: Colors.surface,
     justifyContent: 'center',
     alignItems: 'center',
     marginBottom: 20,
  }
});
