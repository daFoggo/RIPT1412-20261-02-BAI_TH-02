import React, { ComponentType, lazy, Suspense } from 'react';
import { LoadingScreen } from '../components/common/LoadingScreen';

// Helper component that wraps a lazily loaded component with Suspense
export function withSuspense<P extends object>(
  LazyComponent: ComponentType<P>,
  fallbackMessage?: string
): React.FC<P> {
  return function SuspenseWrapper(props: P) {
    return (
      <Suspense fallback={<LoadingScreen message={fallbackMessage} />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Lazy loaded screen components
const LazyLoginScreen = lazy(() => import('../screens/LoginScreen'));
const LazyHomeScreen = lazy(() => import('../screens/HomeScreen'));
const LazyContactsScreen = lazy(() => import('../screens/ContactsScreen'));
const LazyNotificationsScreen = lazy(() => import('../screens/NotificationsScreen'));
const LazySettingsScreen = lazy(() => import('../screens/SettingsScreen'));
const LazyChatDetailScreen = lazy(() => import('../screens/ChatDetailScreen'));

// Export route components with Suspense
export const LoginScreen = withSuspense(LazyLoginScreen, 'Đang tải trang đăng nhập...');
export const HomeScreen = withSuspense(LazyHomeScreen, 'Đang tải tin nhắn...');
export const ContactsScreen = withSuspense(LazyContactsScreen, 'Đang tải danh bạ...');
export const NotificationsScreen = withSuspense(LazyNotificationsScreen, 'Đang tải thông báo...');
export const SettingsScreen = withSuspense(LazySettingsScreen, 'Đang tải cài đặt...');
export const ChatDetailScreen = withSuspense(LazyChatDetailScreen, 'Đang tải cuộc trò chuyện...');
