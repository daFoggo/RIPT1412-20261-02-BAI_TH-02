import React, { createContext, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Badge, Button, Divider, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { NotificationItem } from '../../types/chat';

interface NotificationContextValue {
  item: NotificationItem;
  onRead: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('Notification subcomponents must be used within NotificationItemCard.Root');
  }
  return context;
}

interface RootProps {
  item: NotificationItem;
  onRead: () => void;
  children: React.ReactNode;
}

function NotificationItemCardRoot({ item, onRead, children }: RootProps) {
  const theme = useTheme();

  return (
    <NotificationContext.Provider value={{ item, onRead }}>
      <View
        style={{
          backgroundColor: item.isRead
            ? theme.colors.background
            : theme.colors.surfaceVariant,
        }}
      >
        <TouchableRipple onPress={onRead}>
          <View style={styles.contentRow}>{children}</View>
        </TouchableRipple>
        <Divider />
      </View>
    </NotificationContext.Provider>
  );
}

function NotificationItemCardIcon() {
  const { item } = useNotification();
  const icon = item.icon || 'bell-ring';

  return (
    <View style={styles.avatarWrapper}>
      <Avatar.Icon size={44} icon={icon} />
    </View>
  );
}

function NotificationItemCardContent() {
  const theme = useTheme();
  const { item } = useNotification();

  return (
    <View style={styles.infoWrapper}>
      <Text
        variant="titleMedium"
        style={[
          styles.title,
          { color: theme.colors.onSurface },
          !item.isRead && styles.unreadTitle,
        ]}
      >
        {item.title}
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.content, { color: theme.colors.onSurfaceVariant }]}
      >
        {item.content}
      </Text>
      <Text
        variant="labelSmall"
        style={[styles.timeText, { color: theme.colors.outline }]}
      >
        {item.time}
      </Text>
    </View>
  );
}

function NotificationItemCardAction() {
  const { item, onRead } = useNotification();

  return (
    <View style={styles.actionWrapper}>
      {!item.isRead && <Badge size={10} style={styles.unreadDot} />}
      <Button mode="text" compact disabled={item.isRead} onPress={onRead}>
        {item.isRead ? 'Đã đọc' : 'Đọc'}
      </Button>
    </View>
  );
}

export const NotificationItemCard = {
  Root: NotificationItemCardRoot,
  Icon: NotificationItemCardIcon,
  Content: NotificationItemCardContent,
  Action: NotificationItemCardAction,
};

const styles = StyleSheet.create({
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  avatarWrapper: {
    marginRight: 12,
  },
  infoWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '500',
  },
  unreadTitle: {
    fontWeight: '700',
  },
  content: {
    marginTop: 2,
  },
  timeText: {
    marginTop: 4,
  },
  actionWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 8,
  },
  unreadDot: {
    marginBottom: 4,
  },
});
