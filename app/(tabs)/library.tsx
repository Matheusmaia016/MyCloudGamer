import { Screen } from '@/components/layout/Screen';
import { GameCard } from '@/components/game/GameCard';
import { SectionHeader } from '@/components/game/SectionHeader';
import { AppText } from '@/components/ui/AppText';
import { useGames } from '@/hooks/useGames';

export default function LibraryScreen() {
  const { filteredGames } = useGames();

  return (
    <Screen scroll>
      <SectionHeader subtitle={`${filteredGames.length} jogos`} title="Biblioteca" />
      {filteredGames.map((game) => (
        <GameCard game={game} key={game.id} subtitle={`${game.genre} • ${game.playtimeHours}h`} />
      ))}
      {!filteredGames.length ? <AppText variant="caption">Nenhum jogo encontrado.</AppText> : null}
    </Screen>
  );
}
