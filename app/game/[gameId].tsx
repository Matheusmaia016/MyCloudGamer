import { router, useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';

import { HostStatusBadge } from '@/components/game/HostStatusBadge';
import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { useGames } from '@/hooks/useGames';
import { useHosts } from '@/hooks/useHosts';
import { useSessions } from '@/hooks/useSessions';
import { sessionRealtime } from '@/services/realtime/sessionRealtime';
import { useGameStore } from '@/store/gameStore';
import { useSessionStore } from '@/store/sessionStore';

export default function GameDetailsScreen() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();
  const { allGames } = useGames();
  const { data: hosts } = useHosts();
  const { startGameSession, sessionStarting } = useSessions();
  const toggleFavorite = useGameStore((s) => s.toggleFavorite);
  const favoriteIds = useGameStore((s) => s.favoriteIds);
  const setSession = useSessionStore((s) => s.setSession);

  const game = allGames.find((item) => item.id === gameId);
  const mainHost = hosts?.[0];

  const onPlay = async () => {
    if (!game || !mainHost) return;

    if (mainHost.status !== 'online') {
      Alert.alert('Host offline', 'Seu host precisa estar online para iniciar a sessão.');
      return;
    }

    try {
      const result = await startGameSession({ gameId: game.id, hostId: mainHost.id });
      setSession(result.session.id, 'starting', result.stream?.moonlightUri, result.stream?.instructions);
      sessionRealtime.connect();
      router.push(`/session/${result.session.id}`);
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
        {mainHost ? <HostStatusBadge status={mainHost.status} /> : <AppText variant="caption">Nenhum host pareado.</AppText>}
      </AppCard>

      <AppCard>
        <AppText variant="h3">Sobre</AppText>
        <AppText variant="caption">Experiência imersiva com streaming de baixa latência e controles responsivos.</AppText>
      </AppCard>

      <AppButton onPress={onPlay} title={sessionStarting ? 'Iniciando...' : 'Jogar'} />
      <AppButton onPress={() => toggleFavorite(game.id)} title={favoriteIds.includes(game.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'} />
    </Screen>
  );
}
