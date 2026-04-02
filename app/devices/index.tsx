import { useEffect, useState } from 'react';

import type { Game } from '@/types/entities';
import { HostStatusBadge } from '@/components/game/HostStatusBadge';
import { Screen } from '@/components/layout/Screen';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { useHosts } from '@/hooks/useHosts';
import { hostService } from '@/services/hostService';

export default function DevicesScreen() {
  const { data: hosts, isLoading } = useHosts();
  const [gamesByHost, setGamesByHost] = useState<Record<string, Game[]>>({});

  useEffect(() => {
    const loadGames = async () => {
      if (!hosts?.length) return;
      const entries = await Promise.all(hosts.map(async (host) => [host.id, await hostService.listHostGames(host.id)] as const));
      setGamesByHost(Object.fromEntries(entries));
    };

    void loadGames();
  }, [hosts]);

  return (
    <Screen scroll>
      <AppText variant="h2">Meu PC</AppText>
      {isLoading ? <AppText variant="caption">Carregando dispositivos...</AppText> : null}
      {hosts?.map((host) => (
        <AppCard key={host.id}>
          <AppText variant="h3">{host.name}</AppText>
          <HostStatusBadge status={host.status} />
          <AppText variant="caption">Latência: {host.latencyMs}ms</AppText>
          <AppText variant="caption">Último heartbeat: {host.lastSeenAt ? new Date(host.lastSeenAt).toLocaleString('pt-BR') : 'sem dados'}</AppText>
          <AppText variant="caption">Jogos detectados: {gamesByHost[host.id]?.length ?? 0}</AppText>
        </AppCard>
      ))}
      {!hosts?.length && !isLoading ? <AppText variant="caption">Nenhum host pareado.</AppText> : null}
    </Screen>
  );
}
