import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ChatProvider } from './src/context/ChatContext';
import { ThemeProvider, useAppTheme } from './src/context/ThemeContext';
import { RootNavigator } from './src/navigation/RootNavigator';

function MainApp() {
  const { theme, isDarkMode, navTheme } = useAppTheme();

  React.useEffect(() => {
    (StatusBar as any).setBackgroundColor?.(theme.colors.surface);
  }, [theme.colors.surface]);

  return (
    <PaperProvider theme={theme}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <NavigationContainer theme={navTheme}>
        <RootNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ChatProvider>
          <MainApp />
        </ChatProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
