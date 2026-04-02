import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Modal, Easing } from 'react-native';
import { BlurView } from 'expo-blur';
import { Wallet } from 'lucide-react-native';
import { Colors, Borders } from '@/constants/Theme';
import { AppText } from './AppText';

interface AppLoadingProps {
  visible: boolean;
  message?: string;
}

export const AppLoading = ({ visible, message = 'Đang xác thực bảo mật...' }: AppLoadingProps) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Luôn bắt đầu một vòng lặp vĩnh cửu khi Component được mount
    const startRotation = () => {
      rotateAnim.setValue(0);
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };

    if (visible) {
      startRotation();
    } else {
      rotateAnim.stopAnimation();
    }

    // Đảm bảo dừng hẳn khi unmount để tránh rò rỉ bộ nhớ
    return () => rotateAnim.stopAnimation();
  }, [visible]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
      <View style={styles.container}>
        <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
        
        <View style={styles.glassCard}>
           <View style={styles.iconContainer}>
              <Animated.View 
                style={[
                  styles.halo, 
                  { transform: [{ rotate: spin }] }
                ]} 
              />
              <View style={styles.innerIcon}>
                 <Wallet size={26} color={Colors.primary} strokeWidth={2.5} />
              </View>
           </View>

           <View style={styles.textWrap}>
              <AppText weight="bold" color={Colors.text.primary} style={styles.message}>
                {message}
              </AppText>
              <AppText variant="caption" color={Colors.text.muted} style={styles.subtext}>
                Vui lòng chờ trong giây lát
              </AppText>
           </View>
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
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  glassCard: {
    minWidth: 220,
    maxWidth: '85%',
    paddingHorizontal: 30,
    paddingVertical: 24,
    backgroundColor: 'white',
    borderRadius: Borders.radius.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  iconContainer: {
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  halo: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 3,
    borderColor: 'rgba(124, 58, 237, 0.1)',
    borderTopColor: Colors.primary,
  },
  innerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(124, 58, 237, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrap: {
    alignItems: 'center',
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
  },
  subtext: {
    marginTop: 6,
    fontSize: 12,
    opacity: 0.7,
  }
});
