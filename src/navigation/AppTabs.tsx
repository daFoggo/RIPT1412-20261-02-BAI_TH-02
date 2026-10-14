import React from 'react';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { Icon, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChat } from '../context/ChatContext';
import { MainTabParamList } from '../types/navigation';
import {
  ContactsScreen,
  HomeScreen,
  NotificationsScreen,
  SettingsScreen,
} from './routes';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function AppTabs() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { unreadMessagesTotal, unreadNotificationsTotal } = useChat();

  const screenOptions: BottomTabNavigationOptions = {
    headerShown: false,
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
    tabBarStyle: {
      backgroundColor: theme.colors.surface,
      borderTopColor: theme.colors.outlineVariant,
      borderTopWidth: 0.5,
      height: 60 + (insets.bottom > 0 ? insets.bottom : 8),
      paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
      paddingTop: 8,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: '600',
    },
  };

  return (
    <Tab.Navigator screenOptions={screenOptions} initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Đoạn chat',
          tabBarBadge: unreadMessagesTotal > 0 ? unreadMessagesTotal : undefined,
          tabBarIcon: ({ color, size }) => (
            <Icon source="forum" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          tabBarLabel: 'Danh bạ',
          tabBarIcon: ({ color, size }) => (
            <Icon source="account-multiple" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: 'Thông báo',
          tabBarBadge: unreadNotificationsTotal > 0 ? unreadNotificationsTotal : undefined,
          tabBarIcon: ({ color, size }) => (
            <Icon source="bell" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Cài đặt',
          tabBarIcon: ({ color, size }) => (
            <Icon source="cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
