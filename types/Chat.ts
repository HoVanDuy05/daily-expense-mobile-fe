/**
 * Định nghĩa kiểu dữ liệu cho tính năng Chat.
 */

export interface ChatThread {
  id: string;
  name: string;
  msg: string;
  time: string;
  unread: number;
  online: boolean;
  avatar: string;
}

export type MessageSender = 'me' | 'them';

export interface ChatMessage {
  id: string;
  text: string;
  sender: MessageSender;
  time: string;
}
