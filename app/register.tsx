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
      
      <ScrollView style={styles.container} bounces={false}>
        <View style={styles.topGraphic}>
          <SafeAreaView>
             <View style={{ paddingHorizontal: 30, paddingTop: 40, paddingBottom: 60 }}>
               <AppText variant="h1" color={Colors.white} weight="heavy" style={{ fontSize: 32 }}>Mở Tài khoản</AppText>
               <AppText color="rgba(255,255,255,0.8)" style={{ marginTop: 12 }}>Đồng hành cùng nền tảng tài chính thông minh</AppText>
             </View>
          </SafeAreaView>
        </View>

        <View style={styles.formContainer}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40}}>
            <View style={styles.inputGroup}>
              <AppText weight="bold" color={Colors.text.secondary} style={styles.label}>Họ và tên</AppText>
              <View style={styles.inputWrap}>
                 <User size={20} color={Colors.text.muted} style={styles.icon} />
                 <TextInput 
                   style={styles.input}
                   placeholder="Tên của bạn"
                   placeholderTextColor={Colors.text.muted}
                   value={name}
                   onChangeText={setName}
                 />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <AppText weight="bold" color={Colors.text.secondary} style={styles.label}>Địa chỉ Email</AppText>
              <View style={styles.inputWrap}>
                 <Mail size={20} color={Colors.text.muted} style={styles.icon} />
                 <TextInput 
                   style={styles.input}
                   placeholder="your@email.com"
                   placeholderTextColor={Colors.text.muted}
                   value={email}
                   onChangeText={setEmail}
                   autoCapitalize="none"
                   keyboardType="email-address"
                 />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <AppText weight="bold" color={Colors.text.secondary} style={styles.label}>Mật khẩu bảo mật</AppText>
              <View style={styles.inputWrap}>
                 <Lock size={20} color={Colors.text.muted} style={styles.icon} />
                 <TextInput 
                   style={styles.input}
                   placeholder="Nhập mật khẩu khó đoán"
                   placeholderTextColor={Colors.text.muted}
                   secureTextEntry={!showPassword}
                   value={password}
                   onChangeText={setPassword}
                 />
                 <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                   {showPassword ? <EyeOff size={20} color={Colors.text.muted} /> : <Eye size={20} color={Colors.text.muted} />}
                 </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
               style={[styles.loginBtn, !isFormValid && { opacity: 0.5 }]} 
               onPress={handleRegister} 
               activeOpacity={0.8}
               disabled={!isFormValid || loading}
            >
               <AppText variant="h2" weight="heavy" color={Colors.white} style={{fontSize: 18}}>Tạo Tài khoản mới</AppText>
               <UserPlus size={20} color={Colors.white} style={{position: 'absolute', right: 24}} />
            </TouchableOpacity>

            <View style={styles.footerLink}>
               <AppText color={Colors.text.secondary} style={{fontSize: 14}}>Đã có tài khoản? </AppText>
               <TouchableOpacity onPress={() => router.replace('/login')}>
                  <AppText weight="heavy" color={Colors.primary} style={{fontSize: 14}}>Đăng nhập ngay</AppText>
               </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
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
  topGraphic: {
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 60,
  },
  formContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 13,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: Borders.radius.lg,
    paddingHorizontal: 16,
    height: 60,
    ...Shadows.light,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 15,
    color: Colors.text.primary,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    height: 60,
    borderRadius: Borders.radius.xl,
    marginTop: 20,
    ...Shadows.medium,
  },
  footerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    paddingBottom: 40,
  }
});
