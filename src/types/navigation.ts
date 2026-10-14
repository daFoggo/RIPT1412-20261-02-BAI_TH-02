import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Contacts: undefined;
  Notifications: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  ChatDetail: {
    conversationId: string;
    userName: string;
    userIcon?: string;
    userStatus: 'online' | 'offline';
  };
};
