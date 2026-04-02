import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { PieChart, TrendingDown, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import apiClient from '@/services/api';

import { Colors, Spacing, Shadows, Borders } from '@/constants/Theme';
import { AppText } from '@/components/common/AppText';
import { formatCurrency } from '@/utils/format';

interface CategoryStat {
  label: string;
  amount: number;
  percent: number;
  color: string;
}

export default function StatisticsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<{ total: number; categories: CategoryStat[] }>({ total: 0, categories: [] });

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/expenses/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Lỗi khi tải thống kê:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: Colors.white }}>
         <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
               <ChevronLeft size={24} color={Colors.black} />
            </TouchableOpacity>
            <AppText variant="h2" weight="bold">Báo cáo chi tiêu</AppText>
            <View style={{ width: 40 }} />
         </View>
      </SafeAreaView>

      {loading ? (
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={Colors.primary} />
         </View>
      ) : (
        <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        >
            <View style={styles.chartContainer}>
                <View style={styles.chartCircle}>
                    <PieChart size={120} color={Colors.primary} strokeWidth={1} />
                    <View style={styles.chartCenter}>
                        <AppText variant="tiny" color={Colors.text.secondary}>TỔNG CHI</AppText>
                        <AppText weight="bold" style={{fontSize: 18}}>{formatCurrency(stats.total)}</AppText>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <AppText variant="h3" weight="bold">Theo danh mục</AppText>
                <View style={styles.categoryList}>
                    {stats.categories.length > 0 ? (
                        stats.categories.map((cat, idx) => (
                            <View key={idx} style={styles.categoryRow}>
                                <View style={[styles.colorIndicator, { backgroundColor: cat.color }]} />
                                <View style={{ flex: 1 }}>
                                    <AppText weight="semibold">{cat.label}</AppText>
                                    <AppText variant="tiny" color={Colors.text.secondary}>{cat.percent}% chi tiêu</AppText>
                                </View>
                                <AppText weight="bold">{formatCurrency(cat.amount)}</AppText>
                            </View>
                        ))
                    ) : (
                        <AppText color={Colors.text.muted} style={{ marginTop: 20, textAlign: 'center' }}>Chưa có dữ phục này.</AppText>
                    )}
                </View>
            </View>

            {stats.total > 0 && (
                <View style={styles.insightCard}>
                    <TrendingDown size={24} color={Colors.online} />
                    <View style={styles.insightInfo}>
                        <AppText weight="bold">Tiết kiệm tốt hơn!</AppText>
                        <AppText variant="caption" color={Colors.text.secondary}>Bạn đang quản lý tài chính rất tốt.</AppText>
                    </View>
                </View>
            )}
        </ScrollView>
      )}
    </View>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
  },
  chartCircle: {
     width: 220,
     height: 220,
     borderRadius: 110,
     backgroundColor: Colors.white,
     alignItems: 'center',
     justifyContent: 'center',
     ...Shadows.medium,
  },
  chartCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  categoryList: {
    marginTop: Spacing.md,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  insightCard: {
    margin: Spacing.lg,
    backgroundColor: '#E8F5E9',
    borderRadius: Borders.radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightInfo: {
    marginLeft: 12,
  },
});
