import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator,
  RefreshControl,
  Image
} from 'react-native';
import { UserPlus, Search, UserCheck, Clock, Check, X, Bell } from 'lucide-react-native';
import apiClient from '@/services/api';

import { Colors, Spacing, Shadows, Borders } from '@/constants/Theme';
import { AppText } from '@/components/common/AppText';
import { AppAvatar } from '@/components/common/AppAvatar';

type TabType = 'friends' | 'find' | 'requests' | 'notifications';

export default function SocialScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('friends');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchSocialData = async () => {
    try {
      const [friendsRes, notiRes] = await Promise.all([
        apiClient.get('/friends'),
        apiClient.get('/notifications')
      ]);
      setFriends(friendsRes.data.friends || []);
      setRequests(friendsRes.data.requests || []);
      setNotifications(notiRes.data || []);
    } catch (error) {
      console.error('Lỗi tải dữ liệu xã hội:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSocialData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSocialData();
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await apiClient.get(`/friends/search?q=${searchQuery}`);
      setSearchResults(res.data);
    } catch (error) {
      console.error('Lỗi tìm kiếm:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (userId: number) => {
    try {
      await apiClient.post('/friends/request', { receiver_id: userId });
      alert('Đã gửi lời mời kết bạn!');
      // Update local state if needed
    } catch (error: any) {
      alert(error.response?.data?.message || 'Lỗi khi gửi lời mời.');
    }
  };

  const respondToRequest = async (senderId: number, action: 'accept' | 'decline') => {
    try {
      await apiClient.post('/friends/respond', { sender_id: senderId, action });
      fetchSocialData(); // Refresh list
    } catch (error) {
       console.error('Lỗi phản hồi lời mời:', error);
    }
  };

  const markNotiRead = async (id: string) => {
    try {
      await apiClient.post(`/notifications/${id}/read`);
      fetchSocialData();
    } catch {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppText variant="h1" weight="heavy">Mạng xã hội</AppText>
        <AppText variant="caption" color={Colors.text.secondary}>Kết nối cộng đồng chi tiêu</AppText>
      </View>

      <View style={styles.tabContainer}>
        <TabItem 
          active={activeTab === 'friends'} 
          label="Bạn bè" 
          icon={UserCheck} 
          count={friends.length}
          onPress={() => setActiveTab('friends')} 
        />
        <TabItem 
          active={activeTab === 'find'} 
          label="Tìm kiếm" 
          icon={Search} 
          onPress={() => setActiveTab('find')} 
        />
         <TabItem 
          active={activeTab === 'requests'} 
          label="Lời mời" 
          icon={Clock} 
          count={requests.length}
          onPress={() => setActiveTab('requests')} 
        />
        <TabItem 
          active={activeTab === 'notifications'} 
          label="Thông báo" 
          icon={Bell} 
          count={notifications.filter(n => !n.read_at).length}
          onPress={() => setActiveTab('notifications')} 
        />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {activeTab === 'find' && (
          <View style={styles.searchSection}>
            <View style={styles.searchBar}>
              <Search size={20} color={Colors.text.muted} />
              <TextInput 
                style={styles.searchInput}
                placeholder="Tìm bạn theo tên hoặc email..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
              />
            </View>
            <View style={styles.resultsList}>
              {searchResults.map(user => (
                <View key={user.id} style={styles.userCard}>
                   <AppAvatar uri={user.settings?.avatar} size={50} />
                   <View style={styles.userInfo}>
                      <AppText weight="bold">{user.name}</AppText>
                      <AppText variant="tiny" color={Colors.text.muted}>{user.email}</AppText>
                   </View>
                   <TouchableOpacity style={styles.addBtn} onPress={() => sendFriendRequest(user.id)}>
                      <UserPlus size={18} color={Colors.white} />
                   </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'friends' && (
           <View style={styles.listSection}>
             {friends.length > 0 ? friends.map(friend => (
               <View key={friend.id} style={styles.userCard}>
                 <AppAvatar uri={friend.settings?.avatar} size={50} />
                 <View style={styles.userInfo}>
                    <AppText weight="bold">{friend.name}</AppText>
                    <AppText variant="tiny" color={Colors.text.muted}>Đang theo dõi chi tiêu</AppText>
                 </View>
                 <TouchableOpacity style={styles.chatBtn}>
                    <AppText variant="tiny" weight="bold" color={Colors.primary}>Chi tiết</AppText>
                 </TouchableOpacity>
               </View>
             )) : (
               <View style={styles.emptyWrap}>
                  <AppText color={Colors.text.muted}>Chưa có bạn bè nào. Hãy thử tìm kiếm!</AppText>
               </View>
             )}
           </View>
        )}

        {activeTab === 'requests' && (
           <View style={styles.listSection}>
             {requests.length > 0 ? requests.map(req => (
               <View key={req.id} style={styles.userCard}>
                 <AppAvatar uri={req.settings?.avatar} size={50} />
                 <View style={styles.userInfo}>
                    <AppText weight="bold">{req.name}</AppText>
                    <AppText variant="tiny" color={Colors.text.muted}>Muốn kết bạn với bạn</AppText>
                 </View>
                 <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.acceptBtn} onPress={() => respondToRequest(req.id, 'accept')}>
                       <Check size={18} color={Colors.white} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.declineBtn} onPress={() => respondToRequest(req.id, 'decline')}>
                       <X size={18} color={Colors.white} />
                    </TouchableOpacity>
                 </View>
               </View>
             )) : (
               <View style={styles.emptyWrap}>
                  <AppText color={Colors.text.muted}>Không có lời mời nào đang chờ.</AppText>
               </View>
             )}
           </View>
        )}

        {activeTab === 'notifications' && (
           <View style={styles.listSection}>
             {notifications.map(noti => (
               <TouchableOpacity 
                 key={noti.id} 
                 style={[styles.notiItem, !noti.read_at && styles.notiUnread]}
                 onPress={() => markNotiRead(noti.id)}
               >
                 <View style={styles.notiContent}>
                    <AppText weight={noti.read_at ? "semibold" : "bold"}>{noti.data.title}</AppText>
                    <AppText variant="caption" color={Colors.text.secondary}>{noti.data.message}</AppText>
                 </View>
               </TouchableOpacity>
             ))}
           </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const TabItem = ({ active, label, icon: Icon, onPress, count }: any) => (
  <TouchableOpacity 
    style={[styles.tabItem, active && styles.tabItemActive]} 
    onPress={onPress}
  >
    <View style={styles.tabIconWrap}>
      <Icon size={20} color={active ? Colors.primary : Colors.text.muted} />
      {count > 0 && (
         <View style={styles.badge}>
            <AppText weight="bold" style={{ fontSize: 9, color: Colors.white }}>{count}</AppText>
         </View>
      )}
    </View>
    <AppText variant="tiny" weight="heavy" color={active ? Colors.primary : Colors.text.muted}>
      {label.toUpperCase()}
    </AppText>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
    paddingHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: Colors.primary,
  },
  tabIconWrap: {
    position: 'relative',
    marginBottom: 4,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: Colors.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  searchSection: {
    padding: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  resultsList: {
    marginTop: 20,
  },
  listSection: {
    padding: 10,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 20,
    marginBottom: 12,
    ...Shadows.light,
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  addBtn: {
    backgroundColor: Colors.primary,
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatBtn: {
     backgroundColor: Colors.surface,
     paddingHorizontal: 15,
     paddingVertical: 8,
     borderRadius: 10,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  acceptBtn: {
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineBtn: {
    backgroundColor: Colors.surface,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyWrap: {
    padding: 50,
    alignItems: 'center',
  },
  notiItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  notiUnread: {
    backgroundColor: 'rgba(124, 58, 237, 0.05)',
  },
  notiContent: {
    flex: 1,
  }
});
