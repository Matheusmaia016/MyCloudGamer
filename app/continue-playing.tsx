import { Screen } from '@/components/layout/Screen';
import { GameCard } from '@/components/game/GameCard';
import { SectionHeader } from '@/components/game/SectionHeader';
import { AppText } from '@/components/ui/AppText';
import { useGames } from '@/hooks/useGames';

export default function ContinuePlayingScreen() {
  const { filteredGames, isLoading } = useGames();

  return (
    <Screen scroll>
      <SectionHeader subtitle="Retome suas últimas sessões" title="Continuar jogando" />
      {isLoading ? <AppText variant="caption">Carregando jogos...</AppText> : null}
      {filteredGames
        .filter((g) => !!g.lastPlayedAt)
        .map((game) => (
          <GameCard game={game} key={game.id} subtitle={`Última jogada: ${new Date(game.lastPlayedAt!).toLocaleDateString('pt-BR')}`} />
        ))}
    </Screen>
  );
}
