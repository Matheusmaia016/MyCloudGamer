import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface GameUiState {
  searchTerm: string;
  selectedGenre: string | null;
  favoriteIds: string[];
  setSearchTerm: (value: string) => void;
  setSelectedGenre: (value: string | null) => void;
  toggleFavorite: (gameId: string) => void;
}

export const useGameStore = create<GameUiState>()(
  persist(
    (set, get) => ({
      searchTerm: '',
      selectedGenre: null,
      favoriteIds: ['1', '3', '5'],
      setSearchTerm: (value) => set({ searchTerm: value }),
      setSelectedGenre: (value) => set({ selectedGenre: value }),
      toggleFavorite: (gameId) => {
        const has = get().favoriteIds.includes(gameId);
        set({ favoriteIds: has ? get().favoriteIds.filter((id) => id !== gameId) : [...get().favoriteIds, gameId] });
      },
    }),
    {
      name: 'gamemirror-games',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ favoriteIds: state.favoriteIds, selectedGenre: state.selectedGenre }),
    },
  ),
);
