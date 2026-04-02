import axios from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api',
  timeout: 45000, // Tăng timeout cho Render bản miễn phí (thường load lâu)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// REQUEST: Gắn Token
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('user_token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE: XỬ LÝ LỖI GLOBAL
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error;
    const errorMessage = response?.data?.message || 'Có lỗi hệ thống xảy ra. Vui lòng thử lại sau!';

    if (response) {
      if (response.status === 401) {
        await AsyncStorage.removeItem('user_token');
        Alert.alert('Phiên hết hạn', 'Vui lòng đăng nhập lại để đảm bảo an toàn.');
      } else if (response.status === 422) {
        // Validation - backend đã chuẩn tiếng Việt
        Alert.alert('Dữ liệu chưa đúng', errorMessage);
      } else if (response.status === 500) {
        Alert.alert('Lỗi Server', errorMessage);
      }
    } else {
      Alert.alert('Lỗi mạng', 'Không thể kết nối tới máy chủ. Hãy kiểm tra kết nối mạng của bạn!');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
