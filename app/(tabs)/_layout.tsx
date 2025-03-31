// app/_layout.tsx
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../../context/ThemeContext";
import Feather from '@expo/vector-icons/Feather';

function TabsLayout() {
  const { theme, isDark } = useTheme();

  return (
    <>
      <StatusBar style={theme.statusBar === 'dark' ? 'dark' : 'light'} />
      <Tabs
        screenOptions={{
          tabBarStyle: { 
            backgroundColor: theme.tabBarBackground 
          },
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.secondaryText,
          headerStyle: {
            backgroundColor: theme.card,
          },
          headerTintColor: theme.text,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Alışveriş Listem",
            tabBarLabel: "Listem",
            tabBarIcon: ({ color }) => (
              <Feather name="list" size={24} color={color} />
            ),
            headerShown: true,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profil",
            tabBarLabel: "Profil",
            tabBarIcon: ({ color }) => (
              <Feather name="user" size={24} color={color} />
            ),
            headerShown: true,
          }}
        />
      </Tabs>
    </>
  );
}

// Ana layout bileşeni
export default function AppLayout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <TabsLayout />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}