import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
  MD3Theme,
} from 'react-native-paper';

const { LightTheme: adaptedLight, DarkTheme: adaptedDark } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

export const AppLightTheme: MD3Theme = {
  ...MD3LightTheme,
};

export const AppDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
};

interface ThemeContextType {
  isDarkMode: boolean;
  theme: MD3Theme;
  navTheme: any;
  toggleTheme: () => void;
  setDarkMode: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  theme: AppLightTheme,
  navTheme: adaptedLight,
  toggleTheme: () => {},
  setDarkMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(systemColorScheme === 'dark');

  useEffect(() => {
    setIsDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const setDarkMode = (value: boolean) => {
    setIsDarkMode(value);
  };

  const theme = isDarkMode ? AppDarkTheme : AppLightTheme;
  const navTheme = isDarkMode ? adaptedDark : adaptedLight;

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, navTheme, toggleTheme, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useAppTheme = () => useContext(ThemeContext);
