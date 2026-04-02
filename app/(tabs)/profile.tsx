import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  CreditCard,
  FileText,
  DollarSign,
  Palette,
  Camera
} from 'lucide-react-native';

import { Colors, Spacing, Typography, Borders, Shadows } from '@/constants/Theme';
import { AppText } from '@/components/common/AppText';
import { AppAvatar } from '@/components/common/AppAvatar';
import { useAuth } from '../_layout';
import { useRouter } from 'expo-router';

const MENU_GROUPS = [
  {
    title: 'Công cụ tài chính',
    items: [
       { id: 'stats', icon: FileText, color: '#8B5CF6', label: 'Báo cáo chi tiêu', rightText: 'Xem thống kê' },
       { id: 'wallet', icon: CreditCard, color: '#3B82F6', label: 'Ví của tôi', rightText: '3 ví' },
       { id: 'currency', icon: DollarSign, color: '#10B981', label: 'Đơn vị tiền tệ', rightText: 'VNĐ (đ)' },
    ]
  },
  {
    title: 'Thiết Lập',
    items: [
       { id: 'notify', icon: Bell, color: '#F59E0B', label: 'Thông báo đẩy', isSwitch: true },
       { id: 'security', icon: Shield, color: '#EF4444', label: 'Bảo mật sinh trắc học', isSwitch: true },
       { id: 'theme', icon: Palette, color: '#EC4899', label: 'Giao diện & Chủ đề' },
       { id: 'lang', icon: Settings, color: '#6B7280', label: 'Ngôn ngữ', rightText: 'Tiếng Việt' },
    ]
  },
  {
    title: 'Hỗ Trợ',
    items: [
       { id: 'help', icon: HelpCircle, color: '#0EA5E9', label: 'Trợ giúp & Góp ý' }
    ]
  }
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [notify, setNotify] = useState(true);
  const [security, setSecurity] = useState(false);

  const handleSwitch = (id: string, value: boolean) => {
    if (id === 'notify') setNotify(value);
    if (id === 'security') setSecurity(value);
  };

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['rgba(124, 58, 237, 0.1)', 'transparent']}
        style={styles.headerGradient}
      />
      
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 40) }}>
          
          {/* Header Profile */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarWrap}>
              <AppAvatar uri={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200"} size={90} />
              <TouchableOpacity style={styles.cameraIcon}>
                <Camera size={16} color={Colors.white} />
              </TouchableOpacity>
            </View>
            <AppText variant="h1" weight="heavy" style={styles.userName}>{user?.name || 'Khách'}</AppText>
            <AppText variant="body" color={Colors.text.secondary} weight="semibold">{user?.email || 'Chưa định danh'}</AppText>
          </View>

          {/* Iterating Menu Groups */}
          {MENU_GROUPS.map((group, gIdx) => (
            <View key={gIdx} style={styles.section}>
              <AppText variant="caption" weight="heavy" color={Colors.text.muted} style={styles.sectionTitle}>
                {group.title.toUpperCase()}
              </AppText>
              
              <View style={styles.menuCard}>
                {group.items.map((item, iIdx) => {
                  const Icon = item.icon;
                  return (
                    <TouchableOpacity 
                      key={item.id} 
                      style={[styles.menuRow, iIdx === group.items.length - 1 && { borderBottomWidth: 0 }]}
                      activeOpacity={item.isSwitch ? 1 : 0.7}
                      onPress={() => {
                        if (item.id === 'stats') router.push('/statistics');
                      }}
                    >
                      <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                        <Icon size={20} color={item.color} />
                      </View>
                      <View style={styles.menuContent}>
                        <AppText weight="semibold" style={{fontSize: 16}}>{item.label}</AppText>
                      </View>
                      
                      {item.isSwitch ? (
                         <Switch 
                           value={item.id === 'notify' ? notify : security} 
                           onValueChange={(val) => handleSwitch(item.id, val)}
                           trackColor={{ false: Colors.border, true: Colors.primary }}
                         />
                      ) : (
                        <View style={styles.rowRight}>
                          {item.rightText && (
                            <AppText variant="caption" color={Colors.text.muted} weight="semibold" style={{marginRight: 8}}>
                              {item.rightText}
                            </AppText>
                          )}
                          <ChevronRight size={18} color={Colors.border} />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={() => logout()}>
            <LogOut size={20} color={Colors.error} />
            <AppText weight="bold" color={Colors.error} style={{marginLeft: 10, fontSize: 16}}>
              Đăng xuất tài khoản
            </AppText>
          </TouchableOpacity>

          <AppText align="center" variant="tiny" color={Colors.text.muted} weight="semibold" style={styles.version}>
            Daily Expense AI • Phiên bản 1.0
          </AppText>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 250,
  },
  scrollContent: {
    paddingBottom: 130, // Pad for bottom tabs
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 60 : 20,
    paddingBottom: 30,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 16,
    ...Shadows.medium,
    borderRadius: 45, // half of size
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.background,
  },
  userName: {
    fontSize: 26,
    marginBottom: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    marginLeft: 12,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  menuCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    overflow: 'hidden',
    ...Shadows.light,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.03)',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)', // error tinted
    borderRadius: 20,
  },
  version: {
    marginTop: 24,
    marginBottom: 20,
  }
});
