import type { ComponentProps } from 'react';

import { StyleSheet, TextInput } from 'react-native';

import { theme } from '@/theme';

type AppInputProps = ComponentProps<typeof TextInput>;

export const AppInput = (props: AppInputProps) => {
  return <TextInput placeholderTextColor={theme.colors.textSecondary} style={styles.input} {...props} />;
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: theme.colors.surfaceAlt,
    color: theme.colors.textPrimary,
    padding: 14,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});
