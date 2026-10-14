import React, { createContext, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Badge, Divider, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { Conversation } from '../../types/chat';

interface ConversationContextValue {
  conversation: Conversation;
  isUnread: boolean;
}

const ConversationContext = createContext<ConversationContextValue | null>(null);

function useConversation() {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('Conversation subcomponents must be rendered within ConversationItem.Root');
  }
  return context;
}

interface RootProps {
  conversation: Conversation;
  onPress: () => void;
  children: React.ReactNode;
}

function ConversationItemRoot({ conversation, onPress, children }: RootProps) {
  const isUnread = conversation.unreadCount > 0;

  return (
    <ConversationContext.Provider value={{ conversation, isUnread }}>
      <View>
        <TouchableRipple onPress={onPress}>
          <View style={styles.contentRow}>{children}</View>
        </TouchableRipple>
        <Divider />
      </View>
    </ConversationContext.Provider>
  );
}

function ConversationItemAvatar() {
  const { conversation } = useConversation();
  return (
    <View style={styles.avatarWrapper}>
      <Avatar.Icon size={48} icon={conversation.user.icon || 'account'} />
    </View>
  );
}

function ConversationItemContent() {
  const theme = useTheme();
  const { conversation, isUnread } = useConversation();

  return (
    <View style={styles.infoWrapper}>
      <Text
        variant="titleMedium"
        numberOfLines={1}
        style={[
          styles.userName,
          { color: theme.colors.onSurface },
          isUnread && styles.unreadTitle,
        ]}
      >
        {conversation.user.name}
      </Text>
      <Text
        variant="bodyMedium"
        numberOfLines={1}
        style={[
          styles.lastMessage,
          { color: isUnread ? theme.colors.onSurface : theme.colors.onSurfaceVariant },
          isUnread && styles.unreadMessage,
        ]}
      >
        {conversation.lastMessage}
      </Text>
    </View>
  );
}

function ConversationItemMeta() {
  const theme = useTheme();
  const { conversation, isUnread } = useConversation();

  return (
    <View style={styles.metaWrapper}>
      <Text
        variant="bodySmall"
        style={[
          styles.timeText,
          { color: isUnread ? theme.colors.primary : theme.colors.onSurfaceVariant },
          isUnread && styles.unreadTimeText,
        ]}
      >
        {conversation.lastMessageTime}
      </Text>
      {isUnread && (
        <Badge size={20} style={styles.badge}>
          {conversation.unreadCount}
        </Badge>
      )}
    </View>
  );
}

export const ConversationItem = {
  Root: ConversationItemRoot,
  Avatar: ConversationItemAvatar,
  Content: ConversationItemContent,
  Meta: ConversationItemMeta,
};

const styles = StyleSheet.create({
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  avatarWrapper: {
    marginRight: 12,
  },
  infoWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    marginBottom: 2,
    fontWeight: '600',
  },
  unreadTitle: {
    fontWeight: '700',
  },
  lastMessage: {
    fontSize: 14,
    fontWeight: '400',
  },
  unreadMessage: {
    fontWeight: '600',
  },
  metaWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: 8,
  },
  timeText: {
    marginBottom: 4,
    fontWeight: '400',
  },
  unreadTimeText: {
    fontWeight: '700',
  },
  badge: {
    alignSelf: 'flex-end',
  },
});
