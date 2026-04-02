import { useState, useRef, useMemo } from 'react';
import { FlatList } from 'react-native';
import { ChatMessage } from '@/types/Chat';

/**
 * Hook xử lý logic cho màn hình Chat chi tiết.
 * Quản lý trạng thái tin nhắn và tự động cuộn.
 */
export const useChat = () => {
  const [message, setMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const INITIAL_MESSAGES: ChatMessage[] = useMemo(() => [
    { id: '1', text: 'Chào Linh, dự án chạy ổn không?', sender: 'me', time: '14:15' },
    { id: '2', text: 'Ổn lắm anh ơi, khách hàng vừa feedback ok hết rồi!', sender: 'them', time: '14:16' },
  ], []);

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return {
    message,
    setMessage,
    messages,
    sendMessage,
    flatListRef,
  };
};
