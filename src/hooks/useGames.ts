import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants/queryKeys';
import { gameService } from '@/services/gameService';
import { useGameStore } from '@/store/gameStore';

export const useGames = () => {
  const searchTerm = useGameStore((s) => s.searchTerm);
  const selectedGenre = useGameStore((s) => s.selectedGenre);
  const favoriteIds = useGameStore((s) => s.favoriteIds);

  const query = useQuery({ queryKey: queryKeys.games, queryFn: gameService.listGames });
  const allGames = query.data ?? [];

  const filteredGames = allGames.filter((game) => {
    const searchOk = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    const genreOk = selectedGenre ? game.genre === selectedGenre : true;
    return searchOk && genreOk;
  });

  const favorites = allGames.filter((game) => favoriteIds.includes(game.id));

  return {
    ...query,
    allGames,
    filteredGames,
    favorites,
  };
};
