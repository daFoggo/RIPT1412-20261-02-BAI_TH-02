import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import { Message } from '../../types/chat';

function SentMessage({ message }: { message: Message }) {
  const theme = useTheme();

  return (
    <View style={[styles.row, styles.rowRight]}>
      <Surface
        elevation={1}
        style={[styles.bubble, styles.bubbleRight, { backgroundColor: theme.colors.primaryContainer }]}
      >
        <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer }}>
          {message.text}
        </Text>
        <Text variant="labelSmall" style={[styles.timeLabel, { color: theme.colors.onPrimaryContainer }]}>
          {message.timestamp}
        </Text>
      </Surface>
    </View>
  );
}

function ReceivedMessage({ message }: { message: Message }) {
  const theme = useTheme();

  return (
    <View style={[styles.row, styles.rowLeft]}>
      <Surface
        elevation={1}
        style={[styles.bubble, styles.bubbleLeft, { backgroundColor: theme.colors.surfaceVariant }]}
      >
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          {message.text}
        </Text>
        <Text variant="labelSmall" style={[styles.timeLabel, { color: theme.colors.outline }]}>
          {message.timestamp}
        </Text>
      </Surface>
    </View>
  );
}

export const MessageBubble = {
  Sent: SentMessage,
  Received: ReceivedMessage,
};

const styles = StyleSheet.create({
  row: {
    marginVertical: 4,
    flexDirection: 'row',
  },
  rowRight: {
    justifyContent: 'flex-end',
  },
  rowLeft: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  bubbleRight: {
    borderBottomRightRadius: 4,
  },
  bubbleLeft: {
    borderBottomLeftRadius: 4,
  },
  timeLabel: {
    marginTop: 4,
    alignSelf: 'flex-end',
    opacity: 0.8,
  },
});
