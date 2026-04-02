import { create } from 'zustand';

export type GamepadButtonKey = 'up' | 'down' | 'left' | 'right' | 'a' | 'b' | 'x' | 'y' | 'l' | 'r' | 'start' | 'select';

interface GamepadLayout {
  opacity: number;
  scale: number;
  offsetX: number;
  offsetY: number;
  mode: 'dpad' | 'analog-ready';
}

interface GamepadState {
  pressed: Record<GamepadButtonKey, boolean>;
  layout: GamepadLayout;
  press: (key: GamepadButtonKey) => void;
  release: (key: GamepadButtonKey) => void;
  clear: () => void;
  setOpacity: (value: number) => void;
  setScale: (value: number) => void;
}

const keys: GamepadButtonKey[] = ['up', 'down', 'left', 'right', 'a', 'b', 'x', 'y', 'l', 'r', 'start', 'select'];

const defaultPressed = (): Record<GamepadButtonKey, boolean> =>
  keys.reduce((acc, key) => ({ ...acc, [key]: false }), {} as Record<GamepadButtonKey, boolean>);

export const useGamepadStore = create<GamepadState>((set) => ({
  pressed: defaultPressed(),
  layout: {
    opacity: 0.7,
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    mode: 'dpad',
  },
  press: (key) =>
    set((state) => ({
      pressed: {
        ...state.pressed,
        [key]: true,
      },
    })),
  release: (key) =>
    set((state) => ({
      pressed: {
        ...state.pressed,
        [key]: false,
      },
    })),
  clear: () => set({ pressed: defaultPressed() }),
  setOpacity: (value) =>
    set((state) => ({
      layout: { ...state.layout, opacity: Math.min(1, Math.max(0.2, value)) },
    })),
  setScale: (value) =>
    set((state) => ({
      layout: { ...state.layout, scale: Math.min(1.5, Math.max(0.7, value)) },
    })),
}));
