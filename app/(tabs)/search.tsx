import { View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { GameCard } from '@/components/game/GameCard';
import { SectionHeader } from '@/components/game/SectionHeader';
import { AppInput } from '@/components/ui/AppInput';
import { AppText } from '@/components/ui/AppText';
import { useGames } from '@/hooks/useGames';
import { useGameStore } from '@/store/gameStore';

export default function SearchScreen() {
  const searchTerm = useGameStore((s) => s.searchTerm);
  const setSearchTerm = useGameStore((s) => s.setSearchTerm);
  const { filteredGames, isLoading } = useGames();

  return (
    <Screen scroll>
      <SectionHeader subtitle="Busque por nome ou gênero" title="Busca" />
      <AppInput onChangeText={setSearchTerm} placeholder="Buscar jogo" value={searchTerm} />
      {isLoading ? <AppText variant="caption">Buscando jogos...</AppText> : null}
      <View style={{ gap: 10 }}>
        {filteredGames.map((game) => (
          <GameCard game={game} key={game.id} />
        ))}
      </View>
      {!filteredGames.length && !isLoading ? <AppText variant="caption">Nenhum resultado para sua busca.</AppText> : null}
    </Screen>
  );
}
