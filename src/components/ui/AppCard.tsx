import type { PropsWithChildren } from 'react';

import { StyleSheet, View } from 'react-native';

import { theme } from '@/theme';

interface AppCardProps extends PropsWithChildren {
  padded?: boolean;
}

export const AppCard = ({ children, padded = true }: AppCardProps) => {
  return <View style={[styles.card, padded && styles.padded]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  padded: {
    padding: theme.spacing.md,
  },
});
