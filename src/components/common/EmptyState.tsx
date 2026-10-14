import React, { createContext, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';

interface EmptyStateContextValue {
  theme: any;
}

const EmptyStateContext = createContext<EmptyStateContextValue | null>(null);

function useEmptyState() {
  const context = useContext(EmptyStateContext);
  if (!context) {
    throw new Error('EmptyState compound subcomponents must be used within EmptyState.Root');
  }
  return context;
}

interface RootProps {
  children: React.ReactNode;
}

function EmptyStateRoot({ children }: RootProps) {
  const theme = useTheme();

  return (
    <EmptyStateContext.Provider value={{ theme }}>
      <View style={styles.container}>{children}</View>
    </EmptyStateContext.Provider>
  );
}

function EmptyStateIcon({ icon }: { icon: string }) {
  return <List.Icon icon={icon} />;
}

function EmptyStateTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text variant="titleMedium" style={styles.title}>
      {children}
    </Text>
  );
}

function EmptyStateDescription({ children }: { children: React.ReactNode }) {
  const { theme } = useEmptyState();

  return (
    <Text
      variant="bodySmall"
      style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
    >
      {children}
    </Text>
  );
}

export const EmptyState = {
  Root: EmptyStateRoot,
  Icon: EmptyStateIcon,
  Title: EmptyStateTitle,
  Description: EmptyStateDescription,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  title: {
    marginVertical: 8,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
});
