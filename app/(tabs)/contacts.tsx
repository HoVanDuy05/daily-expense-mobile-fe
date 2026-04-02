import React, { useState, useEffect, useCallback } from 'react';
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
import { UserPlus, Search, UserCheck, Clock, Check, X, Bell, Users } from 'lucide-react-native';
import apiClient from '@/services/api';

import { Colors, Spacing, Shadows, Borders } from '@/constants/Theme';
import { AppText } from '@/components/common/AppText';
import { AppAvatar } from '@/components/common/AppAvatar';
import { AppModal } from '@/components/common/AppModal';

type TabType = 'friends' | 'find' | 'requests';

export default function SocialScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('friends');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });

  const showModal = (title: string, message: string) => {
    setModalContent({ title, message });
    setModalVisible(true);
  };

  const fetchSocialData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchSocialData();
  }, [fetchSocialData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSocialData();
  };

  // Logic Debounce Tìm kiếm
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 500); // Đợi 500ms sau khi ngừng gõ

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/users/search?q=${searchQuery.trim()}`);
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
      showModal('Thành công', 'Đã gửi lời mời kết bạn mới !');
    } catch (error: any) {
      showModal('Thất bại', error.response?.data?.message || 'Có lỗi khi gửi lời mời.');
    }
  };

  const respondToRequest = async (senderId: number, action: 'accept' | 'decline') => {
    try {
      await apiClient.post('/friends/accept/' + senderId); // Theo API backend mới
      fetchSocialData();
    } catch (error) {
       console.error('Lỗi phản hồi lời mời:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read_at).length;

  const EmptyState = ({ icon: Icon, title, sub }: any) => (
    <View style={styles.emptyWrap}>
       <View style={styles.emptyIconCircle}>
          <Icon size={40} color={Colors.text.muted} />
       </View>
       <AppText weight="bold" style={styles.emptyTitle}>{title}</AppText>
       <AppText variant="caption" color={Colors.text.muted} align="center">{sub}</AppText>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header cải tiến với Thông báo */}
      <View style={styles.header}>
        <View>
          <AppText variant="h1" weight="heavy">Mạng xã hội</AppText>
          <AppText variant="caption" color={Colors.text.secondary}>Kết nối cộng đồng chi tiêu</AppText>
        </View>
        <TouchableOpacity style={styles.headerNotiBtn}>
           <Bell size={24} color={Colors.black} />
           {unreadCount > 0 && (
             <View style={styles.headerBadge}>
                <AppText weight="bold" style={{ fontSize: 10, color: Colors.white }}>{unreadCount}</AppText>
             </View>
           )}
        </TouchableOpacity>
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
          label="Tìm bạn" 
          icon={Search} 
          onPress={() => setActiveTab('find')} 
        />
         <TabItem 
          active={activeTab === 'requests'} 
          label="Lời mời" 
          icon={Clock} 
          count={requests.length}
          onPress={() => {
            setActiveTab('requests');
          }} 
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
                returnKeyType="search"
              />
            </View>
            
            <View style={styles.resultsList}>
              {loading ? (
                <ActivityIndicator color={Colors.primary} style={{ marginTop: 20 }} />
              ) : searchResults.length > 0 ? (
                searchResults.map(user => (
                  <View key={user.id} style={styles.userCard}>
                    <AppAvatar uri={user.avatar} size={50} />
                    <View style={styles.userInfo}>
                        <AppText weight="bold">{user.name}</AppText>
                        <AppText variant="tiny" color={Colors.text.muted}>{user.email}</AppText>
                    </View>
                    <TouchableOpacity style={styles.addBtn} onPress={() => sendFriendRequest(user.id)}>
                        <UserPlus size={18} color={Colors.white} />
                    </TouchableOpacity>
                  </View>
                ))
              ) : searchQuery ? (
                <EmptyState 
                  icon={Search} 
                  title="Không tìm thấy ai" 
                  sub="Hãy thử nhập chính xác tên hoặc email của bạn bè." 
                />
              ) : (
                <EmptyState 
                  icon={Users} 
                  title="Tìm kiếm bạn bè" 
                  sub="Nhập tên hoặc email người bạn muốn kết nối." 
                />
              )}
            </View>
          </View>
        )}

        {activeTab === 'friends' && (
           <View style={styles.listSection}>
             {friends.length > 0 ? friends.map(friend => (
               <View key={friend.id} style={styles.userCard}>
                 <AppAvatar uri={friend.avatar} size={50} />
                 <View style={styles.userInfo}>
                    <AppText weight="bold">{friend.name}</AppText>
                    <AppText variant="tiny" color={Colors.text.muted}>Đang theo dõi chi tiêu</AppText>
                 </View>
                 <TouchableOpacity style={styles.chatBtn}>
                    <AppText variant="tiny" weight="bold" color={Colors.primary}>Chi tiết</AppText>
                 </TouchableOpacity>
               </View>
             )) : (
                <EmptyState 
                  icon={Users} 
                  title="Chưa có bạn bè" 
                  sub="Hãy đi tìm những người đồng hành cùng bạn ngay thôi!" 
                />
             )}
           </View>
        )}

        {activeTab === 'requests' && (
           <View style={styles.listSection}>
             {requests.length > 0 ? requests.map(req => (
               <View key={req.id} style={styles.userCard}>
                 <AppAvatar uri={req.avatar} size={50} />
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
                <EmptyState 
                  icon={Clock} 
                  title="Không có lời mời" 
                  sub="Tạm thời chưa có lời mời kết bạn nào mới." 
                />
             )}
           </View>
        )}
      </ScrollView>
      <AppModal 
        visible={modalVisible}
        title={modalContent.title}
        message={modalContent.message}
        onClose={() => setModalVisible(false)}
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerNotiBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: Colors.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
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
    marginTop: 10,
  },
  listSection: {
    padding: 15,
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
    marginTop: 60,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  emptyIconCircle: {
     width: 80,
     height: 80,
     borderRadius: 40,
     backgroundColor: Colors.surface,
     justifyContent: 'center',
     alignItems: 'center',
     marginBottom: 20,
  },
  emptyTitle: {
     fontSize: 18,
     marginBottom: 8,
     color: Colors.text.primary,
  }
});
