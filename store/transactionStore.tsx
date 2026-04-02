import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import apiClient from '@/services/api';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  expense_date: string;
  image: string | null;
  category: string;
  note?: string;
}

interface UploadingData {
  title: string;
  amount: string;
  imageUri?: string | null;
}

interface TransactionContextType {
  transactions: Transaction[];
  loading: boolean;
  isUploading: boolean;
  uploadingData: UploadingData | null; // Dữ liệu đang tải lên để hiện preview
  addTransaction: (formData: FormData, previewData?: UploadingData) => Promise<boolean>;
  refreshTransactions: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType>({
  transactions: [],
  loading: false,
  isUploading: false,
  uploadingData: null,
  addTransaction: async () => false,
  refreshTransactions: async () => {},
});

export function TransactionProvider({ children, isAuthenticated }: { children: ReactNode; isAuthenticated: boolean }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingData, setUploadingData] = useState<UploadingData | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!isAuthenticated) {
      setTransactions([]);
      return;
    }
    setLoading(true);
    try {
      const response = await apiClient.get('/expenses');
      setTransactions(response.data);
    } catch (error) {
      console.error('Lỗi lấy danh sách chi tiêu:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (formData: FormData, previewData?: UploadingData) => {
    setIsUploading(true);
    if (previewData) setUploadingData(previewData);
    
    try {
      await apiClient.post('/expenses', formData);
      await fetchTransactions(); // Refresh danh sách thực
      return true;
    } catch (error) {
      console.error('Lỗi khi lưu chi tiêu:', error);
      return false;
    } finally {
      setIsUploading(false);
      setUploadingData(null);
    }
  };

  return (
    <TransactionContext.Provider value={{ 
      transactions, 
      loading, 
      isUploading, 
      uploadingData,
      addTransaction, 
      refreshTransactions: fetchTransactions 
    }}>
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransactions = () => useContext(TransactionContext);
