import { mockGames } from '@/mocks/games';
import { delay } from '@/utils/delay';

export const fetchGamesMock = async () => {
  await delay(400);
  return mockGames;
};
