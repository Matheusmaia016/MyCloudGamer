import { useEffect } from 'react';

import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useAuthStore } from '@/store/authStore';
import { theme } from '@/theme';

export default function SplashScreen() {
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    const timeout = setTimeout(() => {}, 800);
    return () => clearTimeout(timeout);
  }, []);

  if (isHydrated) return <Redirect href="/" />;

  return (
    <View style={styles.container}>
      <AppText variant="h1">GameMirror</AppText>
      <AppText variant="caption">Sua nuvem gamer pessoal</AppText>
      <ActivityIndicator color={theme.colors.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
});
