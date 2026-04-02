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

interface TransactionContextType {
  transactions: Transaction[];
  loading: boolean;
  addTransaction: (formData: FormData) => Promise<boolean>; // Dùng FormData cho upload ảnh
  refreshTransactions: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType>({
  transactions: [],
  loading: false,
  addTransaction: async () => false,
  refreshTransactions: async () => {},
});

export function TransactionProvider({ children, isAuthenticated }: { children: ReactNode; isAuthenticated: boolean }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

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

  const addTransaction = async (formData: FormData) => {
    try {
      await apiClient.post('/expenses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchTransactions(); // Refresh
      return true;
    } catch (error) {
      console.error('Lỗi khi lưu chi tiêu:', error);
      return false;
    }
  };

  return (
    <TransactionContext.Provider value={{ transactions, loading, addTransaction, refreshTransactions: fetchTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransactions = () => useContext(TransactionContext);
