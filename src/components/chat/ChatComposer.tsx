import React, { createContext, useContext } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Surface, TextInput } from 'react-native-paper';

interface ComposerContextValue {
  text: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
}

const ComposerContext = createContext<ComposerContextValue | null>(null);

function useComposer() {
  const context = useContext(ComposerContext);
  if (!context) {
    throw new Error('Composer subcomponents must be used within ChatComposer.Root');
  }
  return context;
}

interface RootProps {
  text: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  children: React.ReactNode;
}

function ChatComposerRoot({ text, onChangeText, onSubmit, children }: RootProps) {
  return (
    <ComposerContext.Provider value={{ text, onChangeText, onSubmit }}>
      <Surface elevation={2} style={styles.inputArea}>
        {children}
      </Surface>
    </ComposerContext.Provider>
  );
}

function ChatComposerInput() {
  const { text, onChangeText, onSubmit } = useComposer();

  return (
    <TextInput
      mode="outlined"
      placeholder="Nhập tin nhắn..."
      value={text}
      onChangeText={onChangeText}
      style={styles.textInput}
      contentStyle={styles.textInputContent}
      outlineStyle={styles.textInputOutline}
      multiline
      right={
        <TextInput.Icon
          icon="send"
          disabled={!text.trim()}
          onPress={onSubmit}
        />
      }
      onSubmitEditing={onSubmit}
    />
  );
}

export const ChatComposer = {
  Root: ChatComposerRoot,
  Input: ChatComposerInput,
};

const styles = StyleSheet.create({
  inputArea: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
  },
  textInput: {
    maxHeight: 100,
    fontSize: 15,
  },
  textInputContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textInputOutline: {
    borderRadius: 24,
  },
});
