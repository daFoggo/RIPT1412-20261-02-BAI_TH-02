import React, { createContext, useContext, useState } from 'react';
import { Conversation, CurrentUser, Message, NotificationItem, User } from '../types/chat';
import {
  INITIAL_CONVERSATIONS,
  INITIAL_CURRENT_USER,
  INITIAL_NOTIFICATIONS,
  INITIAL_USERS,
} from '../utils/mockData';

interface ChatContextType {
  currentUser: CurrentUser;
  setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUser>>;
  isLoggedIn: boolean;
  login: (username: string, password?: string) => { success: boolean; message?: string };
  logout: () => void;
  conversations: Conversation[];
  contacts: User[];
  notifications: NotificationItem[];
  sendMessage: (conversationId: string, text: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  getOrCreateConversationWithUser: (user: User) => string;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (value: boolean) => void;
  activeStatusEnabled: boolean;
  setActiveStatusEnabled: (value: boolean) => void;
  unreadMessagesTotal: number;
  unreadNotificationsTotal: number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(INITIAL_CURRENT_USER);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [contacts] = useState<User[]>(INITIAL_USERS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // App settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [activeStatusEnabled, setActiveStatusEnabled] = useState<boolean>(true);

  const login = (username: string, password?: string) => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password ? password.trim() : '';

    if (!trimmedUsername) {
      return { success: false, message: 'Vui lòng nhập tên tài khoản!' };
    }
    if (!trimmedPassword) {
      return { success: false, message: 'Vui lòng nhập mật khẩu!' };
    }

    // Đăng nhập thành công
    setIsLoggedIn(true);
    setCurrentUser(prev => ({
      ...prev,
      username: trimmedUsername,
      name: trimmedUsername === 'admin' ? 'Quản trị viên' : trimmedUsername,
    }));
    return { success: true };
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const sendMessage = (conversationId: string, text: string) => {
    if (!text.trim()) return;

    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      senderId: currentUser.id,
      text: text.trim(),
      timestamp: timeString,
      isRead: true,
    };

    setConversations(prev =>
      prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: text.trim(),
            lastMessageTime: timeString,
            messages: [...conv.messages, newMessage],
          };
        }
        return conv;
      })
    );
  };

  const markConversationAsRead = (conversationId: string) => {
    setConversations(prev =>
      prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            unreadCount: 0,
            messages: conv.messages.map(m => ({ ...m, isRead: true })),
          };
        }
        return conv;
      })
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, isRead: true } : notif))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  const getOrCreateConversationWithUser = (user: User): string => {
    const existing = conversations.find(c => c.user.id === user.id);
    if (existing) {
      return existing.id;
    }

    const newConversationId = `conv_${Date.now()}`;
    const newConv: Conversation = {
      id: newConversationId,
      user,
      lastMessage: 'Bắt đầu cuộc trò chuyện mới',
      lastMessageTime: 'Vừa xong',
      unreadCount: 0,
      messages: [
        {
          id: `msg_welcome_${Date.now()}`,
          senderId: user.id,
          text: `Xin chào! Rất vui được kết nối với bạn.`,
          timestamp: 'Vừa xong',
          isRead: true,
        },
      ],
    };

    setConversations(prev => [newConv, ...prev]);
    return newConversationId;
  };

  const unreadMessagesTotal = conversations.reduce((acc, curr) => acc + curr.unreadCount, 0);
  const unreadNotificationsTotal = notifications.filter(n => !n.isRead).length;

  return (
    <ChatContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isLoggedIn,
        login,
        logout,
        conversations,
        contacts,
        notifications,
        sendMessage,
        markConversationAsRead,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        getOrCreateConversationWithUser,
        notificationsEnabled,
        setNotificationsEnabled,
        activeStatusEnabled,
        setActiveStatusEnabled,
        unreadMessagesTotal,
        unreadNotificationsTotal,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
