import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, User, UserPlus, Eye, EyeOff } from 'lucide-react-native';

import { AppText } from '@/components/common/AppText';
import { AppModal } from '@/components/common/AppModal';
import { AppLoading } from '@/components/common/AppLoading';
import { Colors, Borders, Shadows } from '@/constants/Theme';
import apiClient from '@/services/api';
import { useAuth } from './_layout';

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isFormValid = name.trim().length > 0 && email.trim().length > 0 && password.length >= 6;

  const showModal = (title: string, message: string) => {
    setModalContent({ title, message });
    setModalVisible(true);
  };

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      showModal('Thiếu thông tin', 'Vui lòng nhập đầy đủ họ tên, email và mật khẩu.');
      return;
    }
    if (password.length < 6) {
      showModal('Mật khẩu yếu', 'Mật khẩu phải chứa ít nhất 6 ký tự.');
      return;
    }
    
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      const { user, token } = response.data;
      await login(user, token);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.';
      showModal('Đăng ký thất bại', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <AppLoading visible={loading} message="Đang khởi tạo tài khoản..." />
      
      <ScrollView 
        style={styles.container} 
        bounces={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      >
        <SafeAreaView>
          <View style={styles.headerSection}>
            {/* Logo Brand */}
            <View style={styles.logoContainer}>
              <View style={styles.logoInner}>
                <AppText style={{ fontSize: 32 }}>💰</AppText>
              </View>
            </View>
            
            <AppText variant="h1" weight="heavy" style={styles.title}>Tạo tài khoản</AppText>
            <AppText color={Colors.text.secondary} style={styles.subtitle}>
              Bắt đầu hành trình quản lý tài chính thông minh cùng Locket
            </AppText>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <View style={styles.inputWrap}>
                <User size={18} color={Colors.text.muted} style={styles.icon} />
                <TextInput 
                  style={styles.input}
                  placeholder="Họ và tên"
                  placeholderTextColor={Colors.text.muted}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

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

            <View style={styles.inputGroup}>
              <View style={styles.inputWrap}>
                <Lock size={18} color={Colors.text.muted} style={styles.icon} />
                <TextInput 
                  style={styles.input}
                  placeholder="Mật khẩu bảo mật"
                  placeholderTextColor={Colors.text.muted}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                  {showPassword ? <EyeOff size={18} color={Colors.text.muted} /> : <Eye size={18} color={Colors.text.muted} />}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.loginBtn, !isFormValid && { opacity: 0.7 }]} 
              onPress={handleRegister} 
              activeOpacity={0.8}
              disabled={!isFormValid || loading}
            >
              <AppText variant="h3" weight="heavy" color={Colors.white}>Tạo ngay</AppText>
            </TouchableOpacity>

            <View style={styles.footerLink}>
              <AppText color={Colors.text.secondary} style={{ fontSize: 13 }}>Đã có tài khoản? </AppText>
              <TouchableOpacity onPress={() => router.replace('/login')}>
                <AppText weight="heavy" color={Colors.primary} style={{ fontSize: 13 }}>Đăng nhập ngay</AppText>
              </TouchableOpacity>
            </View>
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
  headerSection: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    // Đổ bóng logo
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
    backgroundColor: Colors.primary,
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
    paddingHorizontal: 10,
  },
  formContainer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 16,
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
  loginBtn: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    // Đổ bóng nút bấm
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  footerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  }
});
