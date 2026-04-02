import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Modal, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Database, DollarSign } from 'lucide-react-native';
import { Colors } from '@/constants/Theme';
import { AppText } from './AppText';

interface AppLoadingProps {
  visible: boolean;
  message?: string;
}

/**
 * MONEY FOUNTAIN COMPONENT
 * Hiệu ứng "Phun Tiền" từ rương Database
 */
const MoneyFountain = ({ delay }: { delay: number }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 1800,
        delay,
        useNativeDriver: true,
      })
    ).start();
  }, [anim, delay]);

  // Tiền bay vút lên
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, -120],
  });

  // Bay lượn trái phải ngẫu nhiên
  const translateX = anim.interpolate({
    inputRange: [0, 0.3, 0.6, 1],
    outputRange: [0, delay % 20, -(delay % 30), 10],
  });

  // Hiện ra ở gốc và mờ dần khi lên cao
  const opacity = anim.interpolate({
    inputRange: [0, 0.2, 0.8, 1],
    outputRange: [0, 1, 1, 0],
  });

  // To nhỏ khi bay
  const scale = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.5, 1.2, 0.8],
  });

  return (
    <Animated.View style={[styles.moneyIcon, { opacity, transform: [{ translateY }, { translateX }, { scale }] }]}>
      <DollarSign size={20} color="#F59E0B" strokeWidth={3} />
    </Animated.View>
  );
};

export const AppLoading = ({ visible, message = 'Đang xử lý tài chính...' }: AppLoadingProps) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Rương tiền rung động nhẹ khi phun tiền
      Animated.loop(
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 2, duration: 100, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -2, duration: 100, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [visible, shakeAnim]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.container}>
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
        
        <View style={styles.content}>
          <View style={styles.animationArea}>
             {/* 5 dòng tiền phun lên liên tục */}
             <MoneyFountain delay={0} />
             <MoneyFountain delay={400} />
             <MoneyFountain delay={800} />
             <MoneyFountain delay={1200} />
             <MoneyFountain delay={1600} />

             {/* Rương tiền (Database Icon) */}
             <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
                <Database size={60} color={Colors.primary} strokeWidth={2.5} />
             </Animated.View>
          </View>
          
          <AppText weight="heavy" style={styles.message}>
            {message.toUpperCase()}
          </AppText>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  animationArea: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  moneyIcon: {
    position: 'absolute',
    bottom: 45, // Nằm trên icon Database một chút
  },
  message: {
    marginTop: 10,
    fontSize: 14,
    color: Colors.white,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
