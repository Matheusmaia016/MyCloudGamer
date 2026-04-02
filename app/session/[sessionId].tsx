import { useEffect, useMemo, useState } from 'react';

import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { VirtualGamepad } from '@/components/session/VirtualGamepad';
import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { moonlightLauncher } from '@/services/integrations/moonlightLauncher';
import { sessionRealtime } from '@/services/realtime/sessionRealtime';
import { useGamepadStore } from '@/store/gamepadStore';
import { useSessionStore } from '@/store/sessionStore';

const statusLabel: Record<string, string> = {
  starting: 'Iniciando',
  preparing_host: 'Preparando host',
  connecting: 'Conectando',
  ready: 'Pronto',
  error: 'Erro',
};

export default function SessionScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const liveStatus = useSessionStore((s) => s.liveStatus);
  const currentSessionId = useSessionStore((s) => s.currentSessionId);
  const moonlightUri = useSessionStore((s) => s.moonlightUri);
  const instructions = useSessionStore((s) => s.instructions);
  const updateStatus = useSessionStore((s) => s.updateStatus);

  const pressed = useGamepadStore((s) => s.pressed);
  const opacity = useGamepadStore((s) => s.layout.opacity);
  const scale = useGamepadStore((s) => s.layout.scale);
  const setOpacity = useGamepadStore((s) => s.setOpacity);
  const setScale = useGamepadStore((s) => s.setScale);

  const [openHint, setOpenHint] = useState<string | null>(null);

  useEffect(() => {
    sessionRealtime.connect();

    // fallback funcional caso WS/backend não esteja disponível
    const t1 = setTimeout(() => updateStatus('preparing_host'), 1000);
    const t2 = setTimeout(() => updateStatus('connecting'), 1900);
    const t3 = setTimeout(() => updateStatus('ready'), 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      sessionRealtime.disconnect();
    };
  }, [updateStatus]);

  const shownStatus = currentSessionId === sessionId ? liveStatus : 'starting';

  const pressedNow = useMemo(() => Object.entries(pressed).filter(([, isPressed]) => isPressed).map(([key]) => key.toUpperCase()), [pressed]);

  const onOpenMoonlight = async () => {
    if (!moonlightUri) {
      setOpenHint('URI do Moonlight não disponível para esta sessão.');
      return;
    }

    const result = await moonlightLauncher.open(moonlightUri);
    if (!result.opened) {
      setOpenHint(result.reason ?? 'Não foi possível abrir Moonlight.');
    } else {
      setOpenHint('Moonlight aberto com sucesso.');
    }
  };

  return (
    <Screen>
      <AppText variant="h2">Sessão de jogo</AppText>
      <AppCard>
        <View style={styles.streamPlaceholder}>
          <AppText>🎬 Placeholder de stream</AppText>
          <AppText variant="caption">Session ID: {sessionId}</AppText>
          <AppText variant="caption">Status: {shownStatus ? statusLabel[shownStatus] : 'Iniciando'}</AppText>
          {instructions ? <AppText variant="caption">{instructions}</AppText> : null}
          <VirtualGamepad />
        </View>
      </AppCard>

      <AppCard>
        <AppText variant="caption">Botões pressionados: {pressedNow.length ? pressedNow.join(', ') : 'nenhum'}</AppText>
        <AppText variant="caption">Opacidade: {(opacity * 100).toFixed(0)}% | Tamanho: {scale.toFixed(2)}x</AppText>
        <View style={styles.adjustRow}>
          <AppButton onPress={() => setOpacity(opacity - 0.1)} title="- Opacidade" />
          <AppButton onPress={() => setOpacity(opacity + 0.1)} title="+ Opacidade" />
        </View>
        <View style={styles.adjustRow}>
          <AppButton onPress={() => setScale(scale - 0.1)} title="- Tamanho" />
          <AppButton onPress={() => setScale(scale + 0.1)} title="+ Tamanho" />
        </View>
      </AppCard>

      <AppButton onPress={onOpenMoonlight} title="Abrir Moonlight" />
      {openHint ? <AppText variant="caption">{openHint}</AppText> : null}
      <AppButton onPress={() => {}} title="Encerrar sessão" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  streamPlaceholder: {
    backgroundColor: '#000',
    borderRadius: 12,
    minHeight: 360,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    overflow: 'hidden',
  },
  adjustRow: {
    flexDirection: 'row',
    gap: 8,
  },
});
