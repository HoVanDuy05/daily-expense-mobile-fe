import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { LayoutDashboard, ReceiptText, Users, User, Camera } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors, Typography, Shadows, Borders } from '@/constants/Theme';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 360;

/**
 * Layout của Tab Bar chính - PREMIUM LOCKET version.
 * Tích hợp nút Camera trung tâm cố định trên tất cả các Tab.
 */
export default function TabLayout() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.text.muted,
          tabBarStyle: styles.tabBar,
          tabBarBackground: () => 
            Platform.OS === 'ios' ? (
              <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
            ) : null,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIconStyle: styles.tabIcon,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Tổng quan',
            tabBarIcon: ({ color }) => <LayoutDashboard size={22} color={color} />,
            tabBarItemStyle: { flex: 1 },
          }}
        />
        <Tabs.Screen
          name="timeline"
          options={{
            title: 'Giao dịch',
            tabBarIcon: ({ color }) => <ReceiptText size={22} color={color} />,
            tabBarItemStyle: { flex: 1, marginRight: isSmallScreen ? 25 : 50 },
          }}
        />
        <Tabs.Screen
          name="contacts"
          options={{
            title: 'Mạng xã hội',
            tabBarIcon: ({ color }) => <Users size={22} color={color} />,
            tabBarItemStyle: { flex: 1, marginLeft: isSmallScreen ? 25 : 50 },
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Cá nhân',
            tabBarIcon: ({ color }) => <User size={22} color={color} />,
            tabBarItemStyle: { flex: 1 },
          }}
        />
      </Tabs>

      {/* Nút Camera trung tâm - Tinh chỉnh vị trí chuẩn xác */}
      <View style={styles.cameraContainer} pointerEvents="box-none">
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={() => router.push('/add-expense')}
          style={styles.cameraButton}
        >
          <LinearGradient
            colors={Colors.primaryGradient}
            style={styles.cameraGradient}
          >
            <Camera size={28} color={Colors.white} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 20,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : Colors.white,
    height: Platform.OS === 'ios' ? 95 : 75,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingBottom: Platform.OS === 'ios' ? 35 : 15,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: Typography.fonts.semibold,
    marginTop: -2,
  },
  tabIcon: {
    marginBottom: 2,
  },
  cameraContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 45 : 25,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    backgroundColor: 'transparent', // Quan trọng: không để nền trắng
  },
  cameraButton: {
    borderRadius: isSmallScreen ? 30 : 36,
    ...Shadows.heavy,
    shadowColor: Colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  cameraGradient: {
    width: isSmallScreen ? 60 : 72,
    height: isSmallScreen ? 60 : 72,
    borderRadius: isSmallScreen ? 30 : 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: Colors.white,
  },
});
