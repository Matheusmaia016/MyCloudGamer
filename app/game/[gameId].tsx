import { router, useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { useGames } from '@/hooks/useGames';
import { startSessionMock } from '@/services/mock/session.mock';
import { useGameStore } from '@/store/gameStore';

export default function GameDetailsScreen() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();
  const { data: games } = useGames();
  const toggleFavorite = useGameStore((s) => s.toggleFavorite);
  const favoriteIds = useGameStore((s) => s.favoriteIds);

  const game = games?.find((item) => item.id === gameId);

  const onPlay = async () => {
    if (!game) return;
    try {
      const result = await startSessionMock(game.id);
      router.push(`/session/${result.sessionId}`);
    } catch (error) {
      Alert.alert('Falha ao iniciar', error instanceof Error ? error.message : 'Erro inesperado');
    }
  };

  if (!game) {
    return (
      <Screen>
        <AppText>Jogo não encontrado.</AppText>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <AppCard>
        <AppText style={{ fontSize: 52 }}>{game.image}</AppText>
        <AppText variant="h2">{game.title}</AppText>
        <AppText variant="caption">{game.genre} • ⭐ {game.rating}</AppText>
      </AppCard>

      <AppCard>
        <AppText variant="h3">Sobre</AppText>
        <AppText variant="caption">Experiência imersiva com streaming de baixa latência e controles responsivos.</AppText>
      </AppCard>

      <AppButton onPress={onPlay} title="Jogar" />
      <AppButton onPress={() => toggleFavorite(game.id)} title={favoriteIds.includes(game.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'} />
    </Screen>
  );
}
