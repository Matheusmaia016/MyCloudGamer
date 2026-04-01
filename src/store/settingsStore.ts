import { create } from 'zustand';

import type { QualitySettings } from '@/types/entities';

interface SettingsState {
  quality: QualitySettings;
  setBitrate: (bitrateKbps: number) => void;
  setResolution: (resolution: QualitySettings['resolution']) => void;
  setFps: (fps: QualitySettings['fps']) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  quality: {
    bitrateKbps: 12000,
    resolution: '1080p',
    fps: 60,
  },
  setBitrate: (bitrateKbps) => set((state) => ({ quality: { ...state.quality, bitrateKbps } })),
  setResolution: (resolution) => set((state) => ({ quality: { ...state.quality, resolution } })),
  setFps: (fps) => set((state) => ({ quality: { ...state.quality, fps } })),
}));
