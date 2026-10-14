import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { Icon, PaperProvider, useTheme } from 'react-native-paper';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { ThemeProvider, useAppTheme } from './src/context/ThemeContext';
import DetailScreen from './src/screens/DetailScreen';
import SearchScreen from './src/screens/SearchScreen';
import WeatherScreen from './src/screens/WeatherScreen';

export type RootTabParamList = {
  Weather: { city?: { name: string; localName?: string; lat: number; lon: number } } | undefined;
  Detail: { dayIndex?: number } | undefined;
  Search: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

function AppTabs() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const screenOptions: BottomTabNavigationOptions = {
    headerShown: false,
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
    tabBarStyle: {
      backgroundColor: theme.colors.elevation.level2,
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
    <Tab.Navigator initialRouteName="Weather" screenOptions={screenOptions}>
      <Tab.Screen
        name="Weather"
        component={WeatherScreen}
        options={{
          tabBarLabel: 'Thời tiết',
          tabBarIcon: ({ color, size }) => (
            <Icon source="weather-partly-cloudy" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Detail"
        component={DetailScreen}
        options={{
          tabBarLabel: 'Chi tiết',
          tabBarIcon: ({ color, size }) => (
            <Icon source="chart-timeline-variant" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Tìm kiếm',
          tabBarIcon: ({ color, size }) => (
            <Icon source="magnify" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MainApp() {
  const { theme, isDarkMode, navTheme } = useAppTheme();

  React.useEffect(() => {
    (StatusBar as any).setBackgroundColor?.(theme.colors.background);
  }, [theme.colors.background]);

  return (
    <PaperProvider theme={theme}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <NavigationContainer theme={navTheme}>
        <AppTabs />
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
