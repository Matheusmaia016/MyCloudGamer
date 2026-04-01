import { Screen } from '@/components/layout/Screen';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { useSessions } from '@/hooks/useSessions';
import { formatDateTime } from '@/utils/format';

export default function SessionHistoryScreen() {
  const { data: sessions } = useSessions();

  return (
    <Screen scroll>
      <AppText variant="h2">Histórico de sessões</AppText>
      {sessions?.map((session) => (
        <AppCard key={session.id}>
          <AppText variant="h3">{session.gameTitle}</AppText>
          <AppText variant="caption">Início: {formatDateTime(session.startedAt)}</AppText>
          {session.endedAt ? <AppText variant="caption">Fim: {formatDateTime(session.endedAt)}</AppText> : null}
        </AppCard>
      ))}
    </Screen>
  );
}
