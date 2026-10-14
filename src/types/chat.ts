export interface User {
  id: string;
  name: string;
  username: string;
  icon?: string;
  status: 'online' | 'offline';
  lastActive: string;
  bio?: string;
  email?: string;
  phone?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export type NotificationType = 'message' | 'friend' | 'system' | 'group';

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  time: string;
  isRead: boolean;
  type: NotificationType;
  icon?: string;
}

export interface CurrentUser {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  icon: string;
  bio: string;
  status: 'online' | 'offline';
}
