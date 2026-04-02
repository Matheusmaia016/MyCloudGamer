import type { Game } from '@/types/entities';

import { mockGames } from '@/mocks/games';
import { fetchGamesMock } from '@/services/mock/game.mock';

import { gamemirrorApi } from './api/gamemirrorApi';

export const gameService = {
  async listGames(): Promise<Game[]> {
    try {
      return await gamemirrorApi.listGames();
    } catch {
      return fetchGamesMock();
    }
  },
  async getGameById(gameId: string): Promise<Game | undefined> {
    const games = await gameService.listGames();
    return games.find((game) => game.id === gameId) ?? mockGames.find((game) => game.id === gameId);
  },
};
