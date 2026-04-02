import { create } from 'zustand';

export type LiveSessionStatus = 'starting' | 'preparing_host' | 'connecting' | 'ready' | 'error';

interface SessionStoreState {
  currentSessionId: string | null;
  liveStatus: LiveSessionStatus | null;
  moonlightUri: string | null;
  instructions: string | null;
  setSession: (sessionId: string, status: LiveSessionStatus, moonlightUri?: string, instructions?: string) => void;
  updateStatus: (status: LiveSessionStatus) => void;
  clear: () => void;
}

export const useSessionStore = create<SessionStoreState>((set) => ({
  currentSessionId: null,
  liveStatus: null,
  moonlightUri: null,
  instructions: null,
  setSession: (sessionId, status, moonlightUri, instructions) =>
    set({ currentSessionId: sessionId, liveStatus: status, moonlightUri: moonlightUri ?? null, instructions: instructions ?? null }),
  updateStatus: (status) => set({ liveStatus: status }),
  clear: () => set({ currentSessionId: null, liveStatus: null, moonlightUri: null, instructions: null }),
}));
