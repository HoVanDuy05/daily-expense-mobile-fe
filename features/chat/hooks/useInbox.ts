import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/services/api';

export interface InboxItem {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
}

export function useInbox() {
  const [inbox, setInbox] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInbox = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/messages');
      setInbox(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách inbox:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchInbox();
  }, [fetchInbox]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchInbox();
  };

  return {
    inbox,
    loading,
    refreshing,
    onRefresh,
    refreshInbox: fetchInbox
  };
}
