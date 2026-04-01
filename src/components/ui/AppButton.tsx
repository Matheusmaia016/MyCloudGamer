import type { ReactNode } from 'react';

import { Pressable, StyleSheet, View } from 'react-native';

import { theme } from '@/theme';

import { AppText } from './AppText';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  leftIcon?: ReactNode;
}

export const AppButton = ({ title, onPress, disabled, leftIcon }: AppButtonProps) => {
  return (
    <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed, disabled && styles.disabled]}>
      <View style={styles.content}>
        {leftIcon}
        <AppText style={styles.title}>{title}</AppText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    backgroundColor: theme.colors.accentSoft,
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontWeight: '700',
  },
});
