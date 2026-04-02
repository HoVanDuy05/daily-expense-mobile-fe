import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, ArrowLeft, ShieldCheck } from 'lucide-react-native';

import { AppText } from '@/components/common/AppText';
import { AppModal } from '@/components/common/AppModal';
import { AppLoading } from '@/components/common/AppLoading';
import { Colors, Shadows } from '@/constants/Theme';
import apiClient from '@/services/api';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const isFormValid = email.trim().length > 0 && email.includes('@');

  const showModal = (title: string, message: string) => {
    setModalContent({ title, message });
    setModalVisible(true);
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      showModal('Thiếu thông tin', 'Vui lòng điền Email để khôi phục.');
      return;
    }
    
    setLoading(true);
    try {
      // Giả lập API gửi mail (vì Render free ko hỗ trợ mail tốt)
      await new Promise(resolve => setTimeout(resolve, 2000));
      showModal('Gửi thành công', 'Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu vào Email của bạn!');
    } catch (error: any) {
      showModal('Lỗi hệ thống', 'Có chút trục trặc, vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <AppLoading visible={loading} message="Đang gửi yêu cầu..." />
      
      <ScrollView 
        style={styles.container} 
        bounces={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={24} color={Colors.text.primary} />
          </TouchableOpacity>

          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <View style={styles.logoInner}>
                <ShieldCheck size={36} color={Colors.white} />
              </View>
            </View>
            
            <AppText variant="h1" weight="heavy" style={styles.title}>Quên mật khẩu?</AppText>
            <AppText color={Colors.text.secondary} style={styles.subtitle}>
              Đừng lo lắng! Hãy nhập Email đã đăng ký để chúng tôi giúp bạn khôi phục.
            </AppText>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <View style={styles.inputWrap}>
                <Mail size={18} color={Colors.text.muted} style={styles.icon} />
                <TextInput 
                  style={styles.input}
                  placeholder="Email của bạn"
                  placeholderTextColor={Colors.text.muted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.resetBtn, !isFormValid && { opacity: 0.7 }]} 
              onPress={handleResetPassword} 
              activeOpacity={0.8}
              disabled={!isFormValid || loading}
            >
              <AppText variant="h3" weight="heavy" color={Colors.white}>Gửi yêu cầu</AppText>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>

      <AppModal 
        visible={modalVisible}
        title={modalContent.title}
        message={modalContent.message}
        onClose={() => setModalVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  backBtn: {
    padding: 20,
    marginTop: 10,
  },
  headerSection: {
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 30,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3
  },
  logoInner: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#3B82F6', // Màu xanh bảo mật/an tâm
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    color: Colors.text.secondary,
  },
  formContainer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: 15,
    color: Colors.text.primary,
  },
  resetBtn: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  }
});
