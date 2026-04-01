import { Screen } from '@/components/layout/Screen';
import { HostStatusBadge } from '@/components/game/HostStatusBadge';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { useHosts } from '@/hooks/useHosts';

export default function DevicesScreen() {
  const { data: hosts } = useHosts();

  return (
    <Screen scroll>
      <AppText variant="h2">Dispositivos</AppText>
      {hosts?.map((host) => (
        <AppCard key={host.id}>
          <AppText variant="h3">{host.name}</AppText>
          <HostStatusBadge status={host.status} />
          <AppText variant="caption">Latência: {host.latencyMs}ms</AppText>
        </AppCard>
      ))}
    </Screen>
  );
}
