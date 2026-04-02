import axios from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api',
  timeout: 60000, // Tăng lên 60 giây để Render (bản free) có đủ thời gian khởi động
  headers: {
    'Accept': 'application/json',
  },
});

// REQUEST: Gắn Token bảo mật
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('user_token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE: XỬ LÝ LỖI TOÀN CỤC (Notification System)
apiClient.interceptors.response.use(
  (response) => {
    // Nếu API trả về thành công nhưng có kèm message thông báo (Ví dụ: "Đã lưu xong")
    if (response.data && response.data.message && response.status === 201) {
       // Bạn có thể tùy chọn hiện Alert ở đây nếu muốn
    }
    return response;
  },
  async (error) => {
    let message = 'Đã có lỗi xảy ra. Vui lòng thử lại sau!';

    if (error.response) {
      // 1. Phân tích lỗi từ Backend gửi về
      const data = error.response.data;
      const status = error.response.status;

      if (data && data.message) {
        message = data.message;
      } else if (status === 401) {
        message = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!';
        await AsyncStorage.removeItem('user_token');
      } else if (status === 422) {
        message = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin!';
      } else if (status === 500) {
        message = 'Server đang bận xử lý. Vui lòng thử lại sau giây lát!';
      }
    } else if (error.request) {
      // 2. Lỗi không kết nối được tới máy chủ (Render đang khởi động chẳng hạn)
      message = 'Không thể kết nối tới máy chủ. Hãy đảm bảo mạng của bạn ổn định!';
    }

    // 🏆 THÔNG BÁO LỖI (Log để debug trong giai đoạn này)
    console.error('API Error:', message);

    return Promise.reject(error);
  }
);

export default apiClient;
