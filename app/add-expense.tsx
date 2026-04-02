import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  TextInput,
  Image,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
  Alert,
} from 'react-native';
import { X, Camera as CameraIcon, Image as ImageIcon, RefreshCw, Check, Zap } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import apiClient from '@/services/api';

import { Colors, Spacing, Typography, Borders, Shadows } from '@/constants/Theme';
import { AppText } from '@/components/common/AppText';
import { AppModal } from '@/components/common/AppModal';
import { useTransactions } from '@/store/transactionStore';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 360;

interface Category {
  id: number;
  name: string;
  icon: string;
}

export default function AddExpenseScreen() {
  const router = useRouter();
  const { addTransaction } = useTransactions();
  const [step, setStep] = useState<'camera' | 'info'>('camera');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  
  const progressAnim = useRef(new Animated.Value(0)).current;
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<'off' | 'on' | 'auto'>('off');

  useEffect(() => {
    apiClient.get('/categories').then(res => {
        setCategories(res.data);
        if (res.data.length > 0) setSelectedCategoryId(res.data[0].id);
    });
  }, []);

  const toggleFlash = () => {
    setFlash(prev => {
      if (prev === 'off') return 'on';
      if (prev === 'on') return 'auto';
      return 'off';
    });
  };

  const handlePickGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setModalContent({ title: 'Cần cấp quyền', message: 'Vui lòng cấp quyền truy cập Thư viện ảnh trong Cài đặt để thêm chi tiêu bằng ảnh cũ.' });
      setModalVisible(true);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setStep('info');
    }
  };

  const handleTakePhoto = async () => {
    if (!permission?.granted) {
      const response = await requestPermission();
      if (!response.granted) {
          setModalContent({ title: 'Thiếu quyền Camera', message: 'Để chụp hóa đơn, bạn cần cấp quyền dùng Camera.\nNếu bị từ chối, vui lòng vào Cài đặt để mở lại.' });
          setModalVisible(true);
      }
      return;
    }

    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      if (photo) {
        setImageUri(photo.uri);
        setStep('info');
      }
    }
  };

  const handleSave = async () => {
    const rawAmount = parseInt(amount.replace(/\./g, '') || '0', 10);
    if (rawAmount <= 0) {
      setModalContent({ title: 'Thiếu số tiền', message: 'Vui lòng nhập số tiền chi tiêu.' });
      setModalVisible(true);
      return;
    }

    // CHỐNG LỖI "FORM DATA (0)": Nếu không có ảnh, dùng Object thường để gửi JSON (An toàn nhất trên Web)
    if (!imageUri) {
      const jsonPayload = {
        amount: rawAmount,
        note: note || '',
        category_id: selectedCategoryId || 1,
        title: note || 'Chi tiêu mới'
      };
      
      addTransaction(jsonPayload as any, {
        title: note || 'Chi tiêu mới',
        amount: rawAmount.toString(),
        imageUri: null
      });
    } else {
      // Nếu có ảnh, bắt buộc dùng FormData (Multipart)
      const formData = new FormData();
      formData.append('amount', rawAmount.toString());
      formData.append('note', note);
      formData.append('category_id', selectedCategoryId?.toString() || '1');
      formData.append('title', note || 'Chi tiêu mới');

      const fileName = `expense_${Date.now()}.jpg`;
      if (Platform.OS === 'web') {
        try {
          const response = await fetch(imageUri);
          const blob = await response.blob();
          formData.append('photo', blob, fileName);
        } catch (e) {
          console.error('Lỗi khi chuyển đổi ảnh trên Web:', e);
        }
      } else {
        formData.append('photo', {
          uri: imageUri,
          name: fileName,
          type: 'image/jpeg'
        } as any);
      }

      addTransaction(formData, {
        title: note || 'Chi tiêu mới',
        amount: rawAmount.toString(),
        imageUri: imageUri
      });
    }
    
    router.replace('/(tabs)');
  };

  const handleAmountChange = (text: string) => {
    const numericValue = text.replace(/\D/g, '');
    if (numericValue) {
      const formatted = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      setAmount(formatted);
    } else {
      setAmount('');
    }
  };

  if (step === 'info') {
    if (isSaving) {
      const barWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%']
      });
      return (
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: Colors.surface }}>
              <AppText weight="bold" style={{ fontSize: 18 }}>Đang đăng lên feed...</AppText>
            </View>
            <View style={{ height: 4, backgroundColor: Colors.surface, width: '100%' }}>
               <Animated.View style={{ height: 4, backgroundColor: Colors.primary, width: barWidth }} />
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
               <ActivityIndicator size="large" color={Colors.primary} />
               <AppText color={Colors.text.secondary} align="center" style={{ marginTop: 20 }}>Khoảnh khắc chi tiêu của bạn đang được chia sẻ!</AppText>
            </View>
          </SafeAreaView>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.infoForm}>
            <View style={styles.formHeader}>
              <TouchableOpacity onPress={() => setStep('camera')}>
                <X size={28} color={Colors.black} />
              </TouchableOpacity>
              <AppText variant="h2" weight="heavy">CHI TIẾT</AppText>
              <TouchableOpacity 
                style={[styles.saveBtn, !isFormValid() && { opacity: 0.5 }]} 
                disabled={!isFormValid()}
                onPress={handleSave}
              >
                <AppText weight="bold" color={Colors.white}>Xong</AppText>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.amountInputContainer}>
                <AppText variant="tiny" weight="heavy" color={Colors.text.muted}>SỐ TIỀN</AppText>
                <View style={styles.amountWrap}>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="0"
                    keyboardType="numeric"
                    autoFocus
                    value={amount}
                    onChangeText={handleAmountChange}
                  />
                  <AppText variant="h1" weight="heavy" style={{ marginLeft: 10 }}>₫</AppText>
                </View>
              </View>

              <View style={styles.imagePreviewContainer}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                ) : (
                  <View style={styles.noImagePreview}>
                     <AppText color={Colors.text.muted}>Không có ảnh</AppText>
                  </View>
                )}
              </View>

              <View style={styles.section}>
                 <AppText variant="tiny" weight="heavy" color={Colors.text.muted} style={styles.sectionTitle}>GHI CHÚ</AppText>
                 <TextInput 
                   style={styles.noteInput}
                   placeholder="Hôm nay bạn đã chi những gì?..."
                   multiline
                   value={note}
                   onChangeText={setNote}
                 />
              </View>

              <View style={styles.section}>
                 <AppText variant="tiny" weight="heavy" color={Colors.text.muted} style={styles.sectionTitle}>DANH MỤC</AppText>
                 <View style={styles.categoryWrap}>
                   {categories.map((cat) => (
                      <TouchableOpacity 
                        key={cat.id} 
                        style={[
                          styles.catItem, 
                          selectedCategoryId === cat.id && styles.catItemActive
                        ]}
                        onPress={() => setSelectedCategoryId(cat.id)}
                      >
                         <AppText weight="bold" color={selectedCategoryId === cat.id ? Colors.white : Colors.text.primary}>
                            {cat.icon} {cat.name}
                         </AppText>
                      </TouchableOpacity>
                   ))}
                 </View>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.cameraContainer}>
       <SafeAreaView style={styles.cameraSafeArea}>
          {/* Header */}
          <View style={styles.cameraHeader}>
             <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
                <X size={26} color={Colors.white} />
             </TouchableOpacity>
             <AppText weight="heavy" color={Colors.white} style={styles.headerTitle}>LOCKET CHI TIÊU</AppText>
             <TouchableOpacity style={styles.flashBtn} onPress={toggleFlash}>
                <Zap 
                  size={24} 
                  color={flash === 'off' ? Colors.white : '#FFD700'} 
                  fill={flash === 'on' ? '#FFD700' : 'transparent'} 
                />
             </TouchableOpacity>
          </View>

          {/* Square Camera Preview */}
          <View style={styles.cameraWrapper}>
             <CameraView 
                ref={cameraRef} 
                style={styles.camera} 
                facing="back" 
                enableTorch={flash === 'on'}
                flash={flash}
            />
          </View>
          
          {/* Footer Controls */}
          <View style={styles.cameraFooter}>
             <TouchableOpacity style={styles.subAction} onPress={handlePickGallery}>
                <ImageIcon size={26} color={Colors.white} />
             </TouchableOpacity>

             <TouchableOpacity style={styles.captureBtn} onPress={handleTakePhoto}>
                <View style={styles.captureInner} />
             </TouchableOpacity>

             <TouchableOpacity style={styles.subAction} onPress={() => {}}>
                <RefreshCw size={26} color={Colors.white} />
             </TouchableOpacity>
          </View>

          <View style={styles.cameraTip}>
             <AppText color="rgba(255,255,255,0.4)" variant="tiny">CHỤP CẬN CẢNH HÓA ĐƠN HOẶC MÓN ĂN</AppText>
          </View>
       </SafeAreaView>
    </View>
  );

  function isFormValid() {
    return amount.length > 0 && selectedCategoryId !== null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  cameraSafeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    letterSpacing: 1.2,
  },
  flashBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraWrapper: {
    width: width,
    height: width,
    overflow: 'hidden',
    borderRadius: 40,
    backgroundColor: '#1A1A1A',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  cameraFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 30,
    height: 120,
  },
  captureBtn: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 5,
    borderColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.white,
  },
  subAction: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraTip: {
    alignItems: 'center',
    marginBottom: 20,
  },
  infoForm: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  amountInputContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  amountWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  amountInput: {
    fontSize: 40,
    fontWeight: '900',
    color: Colors.black,
    textAlign: 'right',
  },
  imagePreviewContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    marginBottom: 30,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  noImagePreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  noteInput: {
    fontSize: 16,
    color: Colors.black,
    backgroundColor: Colors.surface,
    borderRadius: 15,
    padding: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  catItem: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  catItemActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
});
