import { Link } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';

import { GameCard } from '@/components/game/GameCard';
import { HostStatusBadge } from '@/components/game/HostStatusBadge';
import { SectionHeader } from '@/components/game/SectionHeader';
import { Screen } from '@/components/layout/Screen';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { useGames } from '@/hooks/useGames';
import { useHosts } from '@/hooks/useHosts';

export default function HomeScreen() {
  const { filteredGames, isLoading: loadingGames, error: gamesError } = useGames();
  const { data: hosts, isLoading: loadingHosts } = useHosts();

  const mainHost = hosts?.[0];
  const continuePlaying = filteredGames.slice(0, 3);
  const trending = filteredGames.slice(3);

  return (
    <Screen scroll>
      <SectionHeader subtitle="Catálogo premium" title="GameMirror" />

      {loadingHosts ? <AppText variant="caption">Carregando status do host...</AppText> : null}
      {mainHost ? (
        <AppCard>
          <AppText variant="h3">{mainHost.name}</AppText>
          <HostStatusBadge status={mainHost.status} />
          <AppText variant="caption">Latência atual: {mainHost.latencyMs}ms</AppText>
        </AppCard>
      ) : null}

      <View style={styles.sectionRow}>
        <SectionHeader title="Continuar jogando" />
        <Link href="/continue-playing">
          <AppText variant="caption">Ver mais</AppText>
        </Link>
      </View>

      {loadingGames ? <AppText variant="caption">Carregando jogos...</AppText> : null}
      {gamesError ? <AppText variant="caption">Falha ao carregar jogos, exibindo fallback.</AppText> : null}

      <FlatList data={continuePlaying} horizontal keyExtractor={(item) => item.id} renderItem={({ item }) => <View style={styles.horizontalCard}><GameCard game={item} /></View>} showsHorizontalScrollIndicator={false} />

      <SectionHeader title="Em alta" />
      {!trending.length && !loadingGames ? <AppText variant="caption">Sem jogos no momento.</AppText> : null}
      {trending.map((game) => (
        <GameCard game={game} key={game.id} />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  horizontalCard: {
    width: 300,
    marginRight: 12,
  },
});
