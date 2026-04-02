import { useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '@/services/api';

export interface ChatMessage {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  read_at: string | null;
  created_at: string;
}

export function useChat(friendId: number) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await apiClient.get<ChatMessage[]>(`/messages/chat/${friendId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Lỗi khi tải tin nhắn:', error);
    } finally {
      setLoading(false);
    }
  }, [friendId]);

  useEffect(() => {
    if (!friendId) return;
    
    fetchMessages();
    
    // Tự động cập nhật tin nhắn mỗi 5 giây (Polling cơ bản)
    timerRef.current = setInterval(fetchMessages, 5000);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchMessages, friendId]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    try {
      setSending(true);
      const response = await apiClient.post('/messages', {
        receiver_id: friendId,
        content: content.trim()
      });
      
      // Thêm ngay tin nhắn mới vào danh sách locally để mượt mà
      setMessages(prev => [...prev, response.data]);
      return true;
    } catch (error) {
      console.error('Gửi tin nhắn thất bại:', error);
      return false;
    } finally {
      setSending(false);
    }
  };

  return {
    messages,
    loading,
    sending,
    sendMessage,
    refreshMessages: fetchMessages
  };
}
