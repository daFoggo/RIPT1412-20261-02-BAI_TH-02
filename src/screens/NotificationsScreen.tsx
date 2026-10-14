import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Appbar, SegmentedButtons, useTheme } from 'react-native-paper';
import { EmptyState } from '../components/common/EmptyState';
import { NotificationItemCard } from '../components/notifications/NotificationItemCard';
import { useChat } from '../context/ChatContext';
import { NotificationItem } from '../types/chat';

export default function NotificationsScreen() {
  const theme = useTheme();
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationsTotal,
  } = useChat();

  const [filterType, setFilterType] = useState('all');

  const filteredNotifications = useMemo(() => {
    if (filterType === 'unread') {
      return notifications.filter((n) => !n.isRead);
    }
    return notifications;
  }, [notifications, filterType]);

  const renderNotificationItem = ({ item }: { item: NotificationItem }) => (
    <NotificationItemCard.Root item={item} onRead={() => markNotificationAsRead(item.id)}>
      <NotificationItemCard.Icon />
      <NotificationItemCard.Content />
      <NotificationItemCard.Action />
    </NotificationItemCard.Root>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content
          title="Thông báo"
          subtitle={
            unreadNotificationsTotal > 0
              ? `${unreadNotificationsTotal} thông báo chưa đọc`
              : 'Đã đọc tất cả thông báo'
          }
        />
        <Appbar.Action
          icon="check-all"
          disabled={unreadNotificationsTotal === 0}
          onPress={markAllNotificationsAsRead}
        />
      </Appbar.Header>

      <View style={styles.segmentedContainer}>
        <SegmentedButtons
          value={filterType}
          onValueChange={setFilterType}
          buttons={[
            {
              value: 'all',
              label: `Tất cả (${notifications.length})`,
              icon: 'bell-outline',
            },
            {
              value: 'unread',
              label: `Chưa đọc (${unreadNotificationsTotal})`,
              icon: 'bell-badge-outline',
            },
          ]}
        />
      </View>

      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState.Root>
            <EmptyState.Icon icon="bell-sleep-outline" />
            <EmptyState.Title>Không có thông báo nào</EmptyState.Title>
            <EmptyState.Description>
              Bạn đã xem hết các thông báo mới
            </EmptyState.Description>
          </EmptyState.Root>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  segmentedContainer: {
    padding: 12,
  },
});
