import { useState, useMemo } from 'react';
import { ChatThread } from '@/types/Chat';

/**
 * Hook xử lý logic cho màn hình Inbox.
 * Tách biệt Logic khỏi UI và sử dụng dữ liệu chuẩn.
 */
export const useInbox = () => {
  const [search, setSearch] = useState('');

  // Mock data với kiểu dữ liệu chuẩn ChatThread
  const CHATS: ChatThread[] = useMemo(() => [
    { id: '1', name: 'Anh Dũng (Team Lead)', msg: 'Vừa hoàn thành dự án xong, chúc mừng cả team nhé!', time: '14:20', unread: 2, online: true, avatar: 'https://i.pravatar.cc/150?u=dung' },
    { id: '2', name: 'Vợ (Quynh Huong 😍)', msg: 'Tối nay nhớ ghé mua đồ ăn cho con nha anh.', time: '12:05', unread: 0, online: true, avatar: 'https://i.pravatar.cc/150?u=trang' },
    { id: '3', name: 'Nhóm Ăn Nhậu', msg: 'Hùng: Cuối tuần này ra quán cũ không anh em?', time: '09:12', unread: 15, online: false, avatar: 'https://i.pravatar.cc/150?u=group' },
    { id: '4', name: 'Nguyễn Văn Linh', msg: 'Link tài liệu thiết kế đây nè bro', time: 'Hôm qua', unread: 0, online: true, avatar: 'https://i.pravatar.cc/150?u=linh' },
    { id: '5', name: 'Support Team', msg: 'Cảm ơn quý khách đã tin dùng dịch vụ.', time: 'T.Hai', unread: 0, online: false, avatar: 'https://i.pravatar.cc/150?u=support' },
    { id: '6', name: 'Lê Mai Anh', msg: 'Mai có đi làm không?', time: 'T.Chủ Nhật', unread: 0, online: true, avatar: 'https://i.pravatar.cc/150?u=mai' },
  ], []);

  const filteredChats = useMemo(() => {
    return CHATS.filter(chat => chat.name.toLowerCase().includes(search.toLowerCase()));
  }, [CHATS, search]);

  return {
    search,
    setSearch,
    chats: filteredChats,
  };
};
