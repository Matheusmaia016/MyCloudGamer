import { useState } from 'react';

import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { hostService } from '@/services/hostService';
import type { ConnectionDiagnostics } from '@/types/entities';

export default function DiagnosticsScreen() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConnectionDiagnostics | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await hostService.diagnostics();
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro no diagnóstico');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <AppText variant="h2">Diagnóstico de conexão</AppText>
      <AppButton onPress={run} title={loading ? 'Executando...' : 'Executar diagnóstico'} />
      {error ? <AppText style={{ color: '#FF6B7A' }}>{error}</AppText> : null}
      {result ? (
        <AppCard>
          <AppText>Ping: {result.pingMs}ms</AppText>
          <AppText>Jitter: {result.jitterMs}ms</AppText>
          <AppText>Perda: {result.packetLossPercent}%</AppText>
          <AppText>Perfil recomendado: {result.recommendedProfile}</AppText>
        </AppCard>
      ) : null}
    </Screen>
  );
}
