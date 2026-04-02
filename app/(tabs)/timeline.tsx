import React, { useState, useMemo } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Image,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { X, Calendar as CalendarIcon, ChevronDown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTransactions } from '@/store/transactionStore';
import { Colors, Shadows } from '@/constants/Theme';
import { AppText } from '@/components/common/AppText';
import { formatCurrency } from '@/utils/format';
import { format, parseISO, getDate } from 'date-fns';

const { width } = Dimensions.get('window');
const GRID_PADDING = 16;
const CELL_SIZE = Math.floor((width - GRID_PADDING * 2) / 7);

const DAYS_IN_MONTH = 31;
const START_DAY = 0; 

export default function LocketCalendarScreen() {
  const { transactions, loading, refreshTransactions } = useTransactions();
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshTransactions();
    setRefreshing(false);
  };

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < START_DAY; i++) {
        days.push({ id: `empty-${i}`, empty: true });
    }
    for (let i = 1; i <= DAYS_IN_MONTH; i++) {
        const transAtDay = transactions.filter(t => getDate(parseISO(t.date || t.expense_date)) === i);
        days.push({ 
          id: `day-${i}`, 
          dayNum: i, 
          image: transAtDay.length > 0 ? transAtDay[0].image : null,
          hasTransactions: transAtDay.length > 0
        });
    }
    return days;
  }, [transactions]);

  const dayTransactions = useMemo(() => {
     return transactions.filter(t => getDate(parseISO(t.date || t.expense_date)) === selectedDay);
  }, [transactions, selectedDay]);

  const renderDayCell = (item: any) => {
    if (item.empty) {
      return <View key={item.id} style={styles.dayCellEmpty} />;
    }

    const isSelected = selectedDay === item.dayNum;
    const hasPhoto = !!item.image;

    return (
      <TouchableOpacity 
        key={item.id}
        style={[styles.dayCell, isSelected && styles.dayCellSelected]} 
        onPress={() => setSelectedDay(item.dayNum)}
      >
        {hasPhoto ? (
           <Image source={{ uri: item.image }} style={styles.dayImage} />
        ) : (
           <AppText variant="tiny" color={isSelected ? Colors.white : Colors.text.muted} weight="bold">
             {item.dayNum}
           </AppText>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.monthSelector}>
          <AppText variant="h2" weight="heavy">THÁNG 3, 2026</AppText>
          <ChevronDown size={20} color={Colors.black} />
        </View>
        <TouchableOpacity style={styles.todayBtn} onPress={() => setSelectedDay(new Date().getDate())}>
           <AppText variant="tiny" weight="heavy" color={Colors.primary}>HÔM NAY</AppText>
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        <View style={styles.calendarGrid}>
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => (
            <View key={d} style={styles.weekdayCell}>
                <AppText variant="tiny" weight="heavy" color={Colors.text.muted}>{d}</AppText>
            </View>
          ))}
          {calendarDays.map(renderDayCell)}
        </View>

        <View style={styles.detailSection}>
           <View style={styles.sectionHeader}>
              <AppText variant="h3" weight="heavy">CHI TIÊU NGÀY {selectedDay}</AppText>
              <AppText variant="caption" weight="bold" color={Colors.text.muted}>
                {dayTransactions.length} KHOẢN
              </AppText>
           </View>

           {loading ? (
              <ActivityIndicator style={{ marginTop: 40 }} color={Colors.primary} />
           ) : dayTransactions.length > 0 ? (
              dayTransactions.map((item) => (
                <View key={item.id} style={styles.transRow}>
                   <View style={styles.transIcon}>
                      <AppText style={{ fontSize: 20 }}>{item.category === 'Ăn uống' ? '🍜' : '📦'}</AppText>
                   </View>
                   <View style={styles.transInfo}>
                      <AppText weight="bold">{item.title}</AppText>
                      <AppText variant="tiny" color={Colors.text.muted}>{item.category}</AppText>
                   </View>
                   <AppText weight="heavy">{formatCurrency(item.amount)}</AppText>
                </View>
              ))
           ) : (
              <View style={styles.emptyDetail}>
                 <AppText color={Colors.text.muted}>Không có chi tiêu nào trong ngày này.</AppText>
              </View>
           )}
        </View>
      </ScrollView>
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
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  todayBtn: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: GRID_PADDING,
    marginTop: 10,
  },
  weekdayCell: {
    width: CELL_SIZE,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCell: {
    width: CELL_SIZE - 4,
    height: CELL_SIZE - 4,
    margin: 2,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  dayCellEmpty: {
    width: CELL_SIZE - 4,
    height: CELL_SIZE - 4,
    margin: 2,
  },
  dayCellSelected: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  dayImage: {
    width: '100%',
    height: '100%',
  },
  detailSection: {
    marginTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  transRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 15,
  },
  transIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  transInfo: {
    flex: 1,
  },
  emptyDetail: {
    padding: 40,
    alignItems: 'center',
  }
});
