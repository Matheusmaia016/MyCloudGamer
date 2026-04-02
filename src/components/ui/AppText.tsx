import type { PropsWithChildren } from 'react';

import { StyleSheet, Text, type TextStyle } from 'react-native';

import { theme } from '@/theme';

interface AppTextProps extends PropsWithChildren {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  style?: TextStyle;
}

export const AppText = ({ children, variant = 'body', style }: AppTextProps) => {
  return <Text style={[styles.base, styles[variant], style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  base: {
    color: theme.colors.textPrimary,
  },
  h1: theme.typography.h1,
  h2: theme.typography.h2,
  h3: theme.typography.h3,
  body: theme.typography.body,
  caption: { ...theme.typography.caption, color: theme.colors.textSecondary },
});
