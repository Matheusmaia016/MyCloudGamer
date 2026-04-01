import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { loginMock, signupMock } from '@/services/mock/auth.mock';
import type { User } from '@/types/entities';

interface AuthState {
  user: User | null;
  token: string | null;
  isHydrated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isHydrated: false,
      loading: false,
      error: null,
      setHydrated: (value) => set({ isHydrated: value }),
      login: async (email, password) => {
        try {
          set({ loading: true, error: null });
          const response = await loginMock(email, password);
          set({ token: response.accessToken, user: response.user, loading: false });
        } catch (error) {
          set({ loading: false, error: error instanceof Error ? error.message : 'Erro inesperado.' });
          throw error;
        }
      },
      signup: async (name, email, password) => {
        try {
          set({ loading: true, error: null });
          const response = await signupMock(name, email, password);
          set({ token: response.accessToken, user: response.user, loading: false });
        } catch (error) {
          set({ loading: false, error: error instanceof Error ? error.message : 'Erro inesperado.' });
          throw error;
        }
      },
      logout: () => set({ user: null, token: null, error: null }),
    }),
    {
      name: 'gamemirror-auth',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);
