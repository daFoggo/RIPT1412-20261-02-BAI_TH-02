import React, { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { Appbar, Avatar, useTheme } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ChatComposer } from '../components/chat/ChatComposer';
import { MessageBubble } from '../components/chat/MessageBubble';
import { useChat } from '../context/ChatContext';
import { Message } from '../types/chat';
import { RootStackParamList } from '../types/navigation';

type ChatDetailRouteProp = RouteProp<RootStackParamList, 'ChatDetail'>;

export default function ChatDetailScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<ChatDetailRouteProp>();
  const { conversationId, userName, userIcon, userStatus } = route.params;

  const { conversations, currentUser, sendMessage } = useChat();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const currentConversation = conversations.find((c) => c.id === conversationId);
  const messages = currentConversation ? currentConversation.messages : [];

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(conversationId, inputText);
    setInputText('');
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isMe = item.senderId === currentUser.id;
    return isMe ? (
      <MessageBubble.Sent message={item} />
    ) : (
      <MessageBubble.Received message={item} />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Avatar.Icon size={38} icon={userIcon || 'account'} style={styles.headerAvatar} />
        <Appbar.Content
          title={userName}
          subtitle={userStatus === 'online' ? 'Đang hoạt động' : 'Ngoại tuyến'}
          titleStyle={styles.headerTitle}
        />
        <Appbar.Action icon="phone-outline" onPress={() => {}} />
        <Appbar.Action icon="video-outline" onPress={() => {}} />
      </Appbar.Header>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        <ChatComposer.Root
          text={inputText}
          onChangeText={setInputText}
          onSubmit={handleSend}
        >
          <ChatComposer.Input />
        </ChatComposer.Root>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  headerAvatar: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  messageList: {
    padding: 16,
    paddingBottom: 8,
  },
});
