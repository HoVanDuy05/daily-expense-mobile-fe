import React from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, Platform } from 'react-native';
import { AppText } from './AppText';
import { Colors, Borders, Shadows } from '@/constants/Theme';

interface AppModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  confirmText?: string;
  onConfirm?: () => void;
}

export function AppModal({ visible, title, message, onClose, confirmText = 'Đóng', onConfirm }: AppModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <AppText variant="h2" weight="heavy" color={Colors.black} align="center">{title}</AppText>
            <AppText variant="body" color={Colors.text.secondary} align="center" style={styles.message}>
              {message}
            </AppText>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.confirmButton} onPress={onConfirm || onClose} activeOpacity={0.8}>
                <AppText weight="bold" color={Colors.white}>{confirmText}</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: Borders.radius.xl,
    padding: 30,
    width: '100%',
    maxWidth: 340,
    ...Shadows.heavy,
  },
  message: {
    marginTop: 12,
    marginBottom: 26,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: Borders.radius.full,
    flex: 1,
    alignItems: 'center',
  }
});
