import { memo } from 'react';

import { Pressable, StyleSheet, View } from 'react-native';

import { theme } from '@/theme';
import type { GamepadButtonKey } from '@/store/gamepadStore';

import { AppText } from '../ui/AppText';

interface GamepadButtonProps {
  label: string;
  buttonKey: GamepadButtonKey;
  pressed: boolean;
  onPressIn: (key: GamepadButtonKey) => void;
  onPressOut: (key: GamepadButtonKey) => void;
  size?: number;
}

const GamepadButtonComponent = ({ label, buttonKey, pressed, onPressIn, onPressOut, size = 58 }: GamepadButtonProps) => {
  return (
    <Pressable
      hitSlop={16}
      onPressIn={() => onPressIn(buttonKey)}
      onPressOut={() => onPressOut(buttonKey)}
      style={[styles.button, pressed && styles.buttonPressed, { width: size, height: size, borderRadius: size / 2 }]}
    >
      <View style={styles.inner}>
        <AppText style={[styles.label, pressed && styles.labelPressed]}>{label}</AppText>
      </View>
    </Pressable>
  );
};

export const GamepadButton = memo(GamepadButtonComponent);

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: theme.colors.accentSoft,
    borderColor: theme.colors.accent,
    transform: [{ scale: 0.96 }],
  },
  inner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontWeight: '700',
    fontSize: 16,
  },
  labelPressed: {
    color: theme.colors.textPrimary,
  },
});
