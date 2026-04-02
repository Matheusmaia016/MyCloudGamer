import { Screen } from '@/components/layout/Screen';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { useSessions } from '@/hooks/useSessions';
import { formatDateTime } from '@/utils/format';

export default function SessionHistoryScreen() {
  const { data: sessions, isLoading } = useSessions();

  return (
    <Screen scroll>
      <AppText variant="h2">Histórico de sessões</AppText>
      {isLoading ? <AppText variant="caption">Carregando histórico...</AppText> : null}
      {sessions?.map((session) => (
        <AppCard key={session.id}>
          <AppText variant="h3">{session.gameTitle ?? session.gameId}</AppText>
          <AppText variant="caption">Início: {formatDateTime(session.startedAt)}</AppText>
          {session.endedAt ? <AppText variant="caption">Fim: {formatDateTime(session.endedAt)}</AppText> : null}
        </AppCard>
      ))}
      {!sessions?.length && !isLoading ? <AppText variant="caption">Nenhuma sessão registrada.</AppText> : null}
    </Screen>
  );
}
