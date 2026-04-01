import { Screen } from '@/components/layout/Screen';
import { GameCard } from '@/components/game/GameCard';
import { SectionHeader } from '@/components/game/SectionHeader';
import { AppText } from '@/components/ui/AppText';
import { useGames } from '@/hooks/useGames';

export default function FavoritesScreen() {
  const { favorites } = useGames();

  return (
    <Screen scroll>
      <SectionHeader subtitle="Seus jogos favoritos" title="Favoritos" />
      {favorites.map((game) => (
        <GameCard game={game} key={game.id} />
      ))}
      {!favorites.length ? <AppText variant="caption">Você ainda não favoritou jogos.</AppText> : null}
    </Screen>
  );
}
