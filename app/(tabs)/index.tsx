import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Plus, 
  MessageCircle, 
  Camera,
  Search,
  History,
  Heart,
  MessageSquare
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors, Spacing, Typography, Shadows, Borders } from '@/constants/Theme';
import { AppText } from '@/components/common/AppText';
import { AppAvatar } from '@/components/common/AppAvatar';
import { formatCurrency } from '@/utils/format';
import { useAuth } from '../_layout';
import { useTransactions } from '@/store/transactionStore';
import type { Transaction } from '@/store/transactionStore';

const { width } = Dimensions.get('window');

/**
 * DASHBOARD PHONG CÁCH LOCKET
 * Chú trọng hình ảnh (chụp hóa đơn, món ăn, đồ mua) và ghi chú nhanh.
 */

// Dữ liệu feed được quản lý qua TransactionStore, không còn dùng hardcode nữa

export default function LocketDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { transactions, loading, refreshTransactions } = useTransactions();
  
  const [refreshing, setRefreshing] = React.useState(false);

  // Tính toán tổng thu chi thực tế động
  const totalBalance = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshTransactions();
    setRefreshing(false);
  }, [refreshTransactions]);

  const renderSpendingCard = ({ item }: { item: Transaction }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <AppAvatar 
          uri={user?.avatar || "https://i.pravatar.cc/150?u=admin"} 
          size={32} 
        />
        <View style={styles.cardHeaderText}>
           <AppText weight="bold" variant="subtext">{user?.name || 'Admin'}</AppText>
           <AppText variant="tiny" color={Colors.text.secondary}>{item.date}</AppText>
        </View>
        <View style={styles.categoryBadge}>
          <AppText variant="tiny" color={Colors.white} weight="bold">{item.category}</AppText>
        </View>
      </View>

      <View style={styles.imageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.cardImage} />
        ) : (
          <View style={[styles.cardImage, { backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' }]}>
            <AppText color={Colors.text.muted} variant="caption">Không có ảnh</AppText>
          </View>
        )}
        <LinearGradient 
          colors={['transparent', 'rgba(0,0,0,0.8)']} 
          style={styles.imageOverlay}
        >
          <View style={styles.overlayContent}>
            <AppText color={Colors.white} variant="h3" weight="heavy">{item.title}</AppText>
            <AppText color={Colors.white} variant="h2" weight="heavy">
              {formatCurrency(item.amount)}
            </AppText>
          </View>
        </LinearGradient>
      </View>
      
      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.reactionButton}>
           <Heart size={16} color={Colors.text.primary} />
           <AppText variant="caption" weight="bold" style={{marginLeft: 6}}>2</AppText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reactionButton}>
           <MessageSquare size={16} color={Colors.text.primary} />
           <AppText variant="caption" weight="bold" style={{marginLeft: 6}}>Ghi chú</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      
      {/* Locket Style Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 10)}]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconButton}>
            <History size={24} color={Colors.black} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerCenter}>
          <AppText variant="h1" weight="heavy" style={styles.logoText}>CHI TIÊU</AppText>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/messages')}
          >
            <MessageCircle size={24} color={Colors.black} />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList<Transaction>
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={renderSpendingCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.balanceSummary}>
            <View style={styles.balanceInfo}>
              <AppText variant="tiny" color={Colors.text.muted} weight="bold">TỔNG THU CHI</AppText>
              <AppText variant="h2" weight="bold" color={totalBalance < 0 ? Colors.error : Colors.online}>
                {formatCurrency(totalBalance)}
              </AppText>
            </View>
            <TouchableOpacity style={styles.searchFab}>
               <Search size={20} color={Colors.text.secondary} />
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={{ alignItems: 'center', paddingTop: 60 }}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <AppText color={Colors.text.muted} style={{ marginTop: 16 }}>Đang tải dữ liệu...</AppText>
            </View>
          ) : (
            <View style={{ alignItems: 'center', paddingTop: 60 }}>
              <AppText variant="h2" style={{ fontSize: 48 }}>📭</AppText>
              <AppText weight="bold" color={Colors.text.secondary} style={{ marginTop: 12 }}>Chưa có chi tiêu nào</AppText>
              <AppText color={Colors.text.muted} style={{ marginTop: 6, textAlign: 'center' }}>Bấm nút + bên dưới để ghi{"\n"}lại khoản chi đầu tiên!</AppText>
            </View>
          )
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} colors={[Colors.primary]} />
        }
      />
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  headerLeft: {
    width: 44,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    width: 44,
    alignItems: 'flex-end',
  },
  logoText: {
    letterSpacing: 2,
    fontSize: 20,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.accent,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  listContent: {
    paddingBottom: 200,
  },
  balanceSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
    marginBottom: Spacing.md,
  },
  balanceInfo: {
    flex: 1,
  },
  searchFab: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    marginBottom: 24,
    backgroundColor: Colors.white,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
  },
  cardHeaderText: {
    marginLeft: 10,
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: Colors.black,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  imageContainer: {
    width: width - 32,
    height: width - 32,
    alignSelf: 'center',
    borderRadius: 30,
    overflow: 'hidden',
    ...Shadows.heavy,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surface,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    height: '40%',
    justifyContent: 'flex-end',
  },
  overlayContent: {
    gap: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 12,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    ...Shadows.light,
  },
});
