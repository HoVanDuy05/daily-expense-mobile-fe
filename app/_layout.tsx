import { useEffect, useState, createContext, useContext, useCallback } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator, Text, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TransactionProvider } from '@/store/transactionStore';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '@/services/api';
import {
  useFonts,
  BeVietnamPro_400Regular,
  BeVietnamPro_500Medium,
  BeVietnamPro_600SemiBold,
  BeVietnamPro_700Bold,
  BeVietnamPro_800ExtraBold,
  BeVietnamPro_900Black
} from '@expo-google-fonts/be-vietnam-pro';

// SplashScreen
SplashScreen.preventAutoHideAsync();

interface UserData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  settings?: any;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  login: (userData: UserData, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    BeVietnamPro_400Regular,
    BeVietnamPro_500Medium,
    BeVietnamPro_600SemiBold,
    BeVietnamPro_700Bold,
    BeVietnamPro_800ExtraBold,
    BeVietnamPro_900Black,
  });

  const [user, setUser] = useState<UserData | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  // Khôi phục Session khi mở App
  const initAuth = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('user_token');
      if (token) {
        // Kiểm tra Token với Backend Laravel
        const response = await apiClient.get('/auth/me');
        const userData = response.data;
        setUser({
          id: userData.id.toString(),
          name: userData.name,
          email: userData.email,
          avatar: userData.settings?.avatar || `https://ui-avatars.com/api/?name=${userData.name}&background=random`,
          settings: userData.settings
        });
      }
    } catch (e) {
      // Token hết hạn hoặc server lỗi...
      await AsyncStorage.removeItem('user_token');
    } finally {
      setIsInitializing(false);
      SplashScreen.hideAsync();
    }
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      initAuth();
    }
  }, [fontsLoaded, fontError, initAuth]);

  // Auth Guard
  useEffect(() => {
    if (isInitializing || !fontsLoaded) return;

    const inProtectedGroup = segments[0] === '(tabs)' || segments[0] === 'add-expense' || segments[0] === 'messages' || segments[0] === 'chat';
    const isAuthenticated = !!user;

    if (!isAuthenticated && inProtectedGroup) {
      router.replace('/login');
    } else if (isAuthenticated && (segments[0] === 'login' || segments[0] === 'register' || segments[0] === undefined)) {
      router.replace('/(tabs)');
    }
  }, [user, segments, isInitializing, fontsLoaded]);

  const loginHandler = async (userData: any, token: string) => {
    await AsyncStorage.setItem('user_token', token);
    setUser({
        id: userData.id.toString(),
        name: userData.name,
        email: userData.email,
        avatar: userData.settings?.avatar || `https://ui-avatars.com/api/?name=${userData.name}&background=random`,
        settings: userData.settings
    });
  };

  const logoutHandler = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {}
    await AsyncStorage.removeItem('user_token');
    setUser(null);
  };

  if (isInitializing || (!fontsLoaded && !fontError)) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ 
          width: 120, 
          height: 120, 
          borderRadius: 35, 
          backgroundColor: '#FFFFFF', 
          justifyContent: 'center', 
          alignItems: 'center', 
          marginBottom: 40,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.08,
          shadowRadius: 20,
          elevation: 5
        }}>
           <Image 
             source={require('../assets/icon.png')} 
             style={{ width: 80, height: 80, borderRadius: 20 }} 
             resizeMode="contain"
           />
        </View>
        <ActivityIndicator size="small" color="#7C3AED" />
        <Text style={{ 
          marginTop: 24, 
          color: '#94A3B8', 
          fontSize: 14, 
          fontWeight: '500',
          letterSpacing: 0.5
        }}>
          Đang khởi tạo ứng dụng...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthContext.Provider value={{
        isAuthenticated: !!user,
        user,
        login: loginHandler,
        logout: logoutHandler
      }}>
        <TransactionProvider isAuthenticated={!!user}>
          <View style={{ flex: 1 }}>
            <StatusBar style="dark" translucent />
            <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="messages" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="add-expense" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
              <Stack.Screen name="chat/[id]" options={{ presentation: 'card' }} />
            </Stack>
          </View>
        </TransactionProvider>
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
}
