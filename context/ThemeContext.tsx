// context/ThemeContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Light ve dark tema için renk paletleri
export const lightTheme = {
  background: '#f5f5f5',
  card: '#ffffff',
  text: '#121212',
  secondaryText: '#666666',
  border: '#dddddd',
  primary: '#007bff',
  inputBackground: '#ffffff',
  inputDisabled: '#f9f9f9',
  inputText: '#121212',
  tabBarBackground: '#ffffff',
  statusBar: 'dark',
};

export const darkTheme = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#ffffff',
  secondaryText: '#aaaaaa',
  border: '#333333',
  primary: '#0a84ff',
  inputBackground: '#2c2c2c',
  inputDisabled: '#252525',
  inputText: '#ffffff',
  tabBarBackground: '#1e1e1e',
  statusBar: 'light',
};

// Tema tipini tanımlama
export type Theme = typeof lightTheme;

// Context için tipler
type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
};

// Theme Context oluşturma
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme Provider bileşeni
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // AsyncStorage'dan tema tercihini yükleme
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const value = await AsyncStorage.getItem('@theme_preference');
      setIsDark(value === 'dark');
    } catch (e) {
      console.error('Tema tercihi yüklenirken hata:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Tema tercihini değiştirme ve kaydetme
  const toggleTheme = async () => {
    const newMode = !isDark;
    setIsDark(newMode);
    try {
      await AsyncStorage.setItem('@theme_preference', newMode ? 'dark' : 'light');
    } catch (e) {
      console.error('Tema tercihi kaydedilirken hata:', e);
    }
  };

  // Mevcut tema değerine göre tema nesnesini belirle
  const theme = isDark ? darkTheme : lightTheme;

  // Tema henüz yüklenmediyse null döndür
  if (isLoading) return null;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Tema bağlamını kullanmak için hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};