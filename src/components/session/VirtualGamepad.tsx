import { memo } from 'react';

import { StyleSheet, View } from 'react-native';

import { useGamepadStore } from '@/store/gamepadStore';

import { GamepadButton } from './GamepadButton';

const VirtualGamepadComponent = () => {
  const pressed = useGamepadStore((s) => s.pressed);
  const opacity = useGamepadStore((s) => s.layout.opacity);
  const scale = useGamepadStore((s) => s.layout.scale);
  const press = useGamepadStore((s) => s.press);
  const release = useGamepadStore((s) => s.release);

  const size = Math.round(56 * scale);

  return (
    <View pointerEvents="box-none" style={[styles.overlay, { opacity }]}> 
      <View style={styles.topTriggers}>
        <GamepadButton buttonKey="l" label="L" onPressIn={press} onPressOut={release} pressed={pressed.l} size={Math.round(size * 0.9)} />
        <GamepadButton buttonKey="r" label="R" onPressIn={press} onPressOut={release} pressed={pressed.r} size={Math.round(size * 0.9)} />
      </View>

      <View style={styles.mainRow}>
        <View style={styles.dpadWrap}>
          <View style={styles.dpadCol}>
            <GamepadButton buttonKey="up" label="▲" onPressIn={press} onPressOut={release} pressed={pressed.up} size={size} />
            <View style={styles.dpadMidRow}>
              <GamepadButton buttonKey="left" label="◀" onPressIn={press} onPressOut={release} pressed={pressed.left} size={size} />
              <View style={{ width: size * 0.5 }} />
              <GamepadButton buttonKey="right" label="▶" onPressIn={press} onPressOut={release} pressed={pressed.right} size={size} />
            </View>
            <GamepadButton buttonKey="down" label="▼" onPressIn={press} onPressOut={release} pressed={pressed.down} size={size} />
          </View>
        </View>

        <View style={styles.faceButtonsWrap}>
          <View style={styles.faceRowTop}>
            <GamepadButton buttonKey="x" label="X" onPressIn={press} onPressOut={release} pressed={pressed.x} size={size} />
            <GamepadButton buttonKey="y" label="Y" onPressIn={press} onPressOut={release} pressed={pressed.y} size={size} />
          </View>
          <View style={styles.faceRowBottom}>
            <GamepadButton buttonKey="a" label="A" onPressIn={press} onPressOut={release} pressed={pressed.a} size={size} />
            <GamepadButton buttonKey="b" label="B" onPressIn={press} onPressOut={release} pressed={pressed.b} size={size} />
          </View>
        </View>
      </View>

      <View style={styles.bottomActions}>
        <GamepadButton buttonKey="select" label="Select" onPressIn={press} onPressOut={release} pressed={pressed.select} size={Math.round(size * 1.1)} />
        <GamepadButton buttonKey="start" label="Start" onPressIn={press} onPressOut={release} pressed={pressed.start} size={Math.round(size * 1.1)} />
      </View>
    </View>
  );
};

export const VirtualGamepad = memo(VirtualGamepadComponent);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  topTriggers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dpadWrap: {
    width: '45%',
    alignItems: 'flex-start',
  },
  dpadCol: {
    gap: 8,
  },
  dpadMidRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  faceButtonsWrap: {
    width: '45%',
    gap: 12,
    alignItems: 'flex-end',
  },
  faceRowTop: {
    flexDirection: 'row',
    gap: 10,
  },
  faceRowBottom: {
    flexDirection: 'row',
    gap: 10,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
  },
});
