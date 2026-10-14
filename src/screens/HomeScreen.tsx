import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Appbar, Searchbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ConversationItem } from '../components/chat/ConversationItem';
import { EmptyState } from '../components/common/EmptyState';
import { useChat } from '../context/ChatContext';
import { Conversation } from '../types/chat';
import { RootStackParamList } from '../types/navigation';

export default function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { conversations, markConversationAsRead } = useChat();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase().trim();
    return conversations.filter(
      (conv) =>
        conv.user.name.toLowerCase().includes(q) ||
        conv.lastMessage.toLowerCase().includes(q)
    );
  }, [conversations, searchQuery]);

  const handleOpenChat = (item: Conversation) => {
    markConversationAsRead(item.id);
    navigation.navigate('ChatDetail', {
      conversationId: item.id,
      userName: item.user.name,
      userIcon: item.user.icon || 'account',
      userStatus: item.user.status,
    });
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <ConversationItem.Root conversation={item} onPress={() => handleOpenChat(item)}>
      <ConversationItem.Avatar />
      <ConversationItem.Content />
      <ConversationItem.Meta />
    </ConversationItem.Root>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content title="Đoạn chat" subtitle={`${conversations.length} cuộc trò chuyện`} />
      </Appbar.Header>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Tìm kiếm cuộc trò chuyện..."
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
      </View>

      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        renderItem={renderConversationItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState.Root>
            <EmptyState.Icon icon="chat-remove-outline" />
            <EmptyState.Title>Không có cuộc trò chuyện nào</EmptyState.Title>
            <EmptyState.Description>
              Thử tìm kiếm với tên hoặc từ khóa khác
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
  searchContainer: {
    padding: 12,
  },
});
