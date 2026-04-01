import type { PropsWithChildren } from 'react';

import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { theme } from '@/theme';

interface ScreenProps extends PropsWithChildren {
  scroll?: boolean;
}

export const Screen = ({ children, scroll = false }: ScreenProps) => {
  const content = <View style={styles.inner}>{children}</View>;

  return (
    <SafeAreaView style={styles.safeArea}>
      {scroll ? <ScrollView contentContainerStyle={styles.scroll}>{content}</ScrollView> : content}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  inner: {
    flex: 1,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  scroll: {
    flexGrow: 1,
  },
});
