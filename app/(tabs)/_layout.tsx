import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { theme } from '@/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#10131C', borderTopColor: '#2C3447' },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Ionicons color={color} name="home" size={size} /> }} />
      <Tabs.Screen name="library" options={{ title: 'Biblioteca', tabBarIcon: ({ color, size }) => <Ionicons color={color} name="library" size={size} /> }} />
      <Tabs.Screen name="search" options={{ title: 'Busca', tabBarIcon: ({ color, size }) => <Ionicons color={color} name="search" size={size} /> }} />
      <Tabs.Screen name="favorites" options={{ title: 'Favoritos', tabBarIcon: ({ color, size }) => <Ionicons color={color} name="heart" size={size} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil', tabBarIcon: ({ color, size }) => <Ionicons color={color} name="person" size={size} /> }} />
    </Tabs>
  );
}
