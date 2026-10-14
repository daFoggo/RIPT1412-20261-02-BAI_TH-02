import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useChat } from '../context/ChatContext';
import { RootStackParamList } from '../types/navigation';
import { AppTabs } from './AppTabs';
import { ChatDetailScreen, LoginScreen } from './routes';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isLoggedIn } = useChat();

  return (
    <Stack.Navigator
      initialRouteName={isLoggedIn ? 'Main' : 'Login'}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={AppTabs} />
      <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
    </Stack.Navigator>
  );
}
