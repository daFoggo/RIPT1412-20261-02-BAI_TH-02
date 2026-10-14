import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Appbar, Searchbar, SegmentedButtons, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EmptyState } from '../components/common/EmptyState';
import { ContactItem } from '../components/contacts/ContactItem';
import { useChat } from '../context/ChatContext';
import { User } from '../types/chat';
import { RootStackParamList } from '../types/navigation';

export default function ContactsScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { contacts, getOrCreateConversationWithUser } = useChat();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredContacts = useMemo(() => {
    return contacts.filter((user) => {
      const matchSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const matchFilter = filterType === 'all' || user.status === 'online';
      return matchSearch && matchFilter;
    });
  }, [contacts, searchQuery, filterType]);

  const onlineCount = useMemo(
    () => contacts.filter((u) => u.status === 'online').length,
    [contacts]
  );

  const handleOpenConversation = (user: User) => {
    const conversationId = getOrCreateConversationWithUser(user);
    navigation.navigate('ChatDetail', {
      conversationId,
      userName: user.name,
      userIcon: user.icon || 'account',
      userStatus: user.status,
    });
  };

  const renderContactItem = ({ item }: { item: User }) => (
    <ContactItem.Root user={item} onPress={() => handleOpenConversation(item)}>
      <ContactItem.Avatar />
      <ContactItem.Info />
      <ContactItem.Status />
      <ContactItem.Action />
    </ContactItem.Root>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content
          title="Danh bạ"
          subtitle={`${contacts.length} liên hệ • ${onlineCount} trực tuyến`}
        />
      </Appbar.Header>

      <View style={styles.headerControls}>
        <Searchbar
          placeholder="Tìm kiếm bạn bè..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        <SegmentedButtons
          value={filterType}
          onValueChange={setFilterType}
          buttons={[
            {
              value: 'all',
              label: `Tất cả (${contacts.length})`,
              icon: 'account-group',
            },
            {
              value: 'online',
              label: `Trực tuyến (${onlineCount})`,
              icon: 'account-check',
            },
          ]}
        />
      </View>

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContactItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState.Root>
            <EmptyState.Icon icon="account-search" />
            <EmptyState.Title>Không tìm thấy người dùng</EmptyState.Title>
            <EmptyState.Description>
              Vui lòng thử tìm kiếm với tên khác
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
  headerControls: {
    padding: 12,
    gap: 12,
  },
  searchBar: {
    elevation: 0,
  },
});
