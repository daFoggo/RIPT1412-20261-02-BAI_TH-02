import React, { createContext, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Divider, IconButton, List, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { User } from '../../types/chat';

interface ContactContextValue {
  user: User;
  isOnline: boolean;
  onChat: () => void;
}

const ContactContext = createContext<ContactContextValue | null>(null);

function useContact() {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('Contact subcomponents must be rendered within ContactItem.Root');
  }
  return context;
}

interface RootProps {
  user: User;
  onPress: () => void;
  children: React.ReactNode;
}

function ContactItemRoot({ user, onPress, children }: RootProps) {
  const isOnline = user.status === 'online';

  return (
    <ContactContext.Provider value={{ user, isOnline, onChat: onPress }}>
      <View>
        <TouchableRipple onPress={onPress}>
          <View style={styles.contentRow}>{children}</View>
        </TouchableRipple>
        <Divider />
      </View>
    </ContactContext.Provider>
  );
}

function ContactItemAvatar() {
  const { user } = useContact();
  return (
    <View style={styles.avatarWrapper}>
      <Avatar.Icon size={48} icon={user.icon || 'account'} />
    </View>
  );
}

function ContactItemInfo() {
  const theme = useTheme();
  const { user, isOnline } = useContact();

  return (
    <View style={styles.infoWrapper}>
      <Text variant="titleMedium" numberOfLines={1} style={{ color: theme.colors.onSurface }}>
        {user.name}
      </Text>
      <Text
        variant="bodySmall"
        style={[
          styles.statusText,
          { color: isOnline ? theme.colors.primary : theme.colors.onSurfaceVariant },
          isOnline && styles.onlineStatusText,
        ]}
      >
        {isOnline ? 'Đang hoạt động' : user.lastActive}
      </Text>
    </View>
  );
}

function ContactItemStatus() {
  const theme = useTheme();
  const { isOnline } = useContact();

  return (
    <List.Icon
      icon={isOnline ? 'circle' : 'circle-outline'}
      color={isOnline ? theme.colors.primary : theme.colors.outline}
    />
  );
}

function ContactItemAction() {
  const { onChat } = useContact();

  return (
    <IconButton
      icon="chat-outline"
      mode="contained-tonal"
      size={20}
      onPress={onChat}
    />
  );
}

export const ContactItem = {
  Root: ContactItemRoot,
  Avatar: ContactItemAvatar,
  Info: ContactItemInfo,
  Status: ContactItemStatus,
  Action: ContactItemAction,
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
  statusText: {
    fontWeight: '400',
  },
  onlineStatusText: {
    fontWeight: '600',
  },
});
