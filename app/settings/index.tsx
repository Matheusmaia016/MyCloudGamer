import { Screen } from '@/components/layout/Screen';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { useSettingsStore } from '@/store/settingsStore';

export default function SettingsScreen() {
  const quality = useSettingsStore((s) => s.quality);

  return (
    <Screen>
      <AppText variant="h2">Configurações</AppText>
      <AppCard>
        <AppText>Bitrate: {quality.bitrateKbps} kbps</AppText>
        <AppText>Resolução: {quality.resolution}</AppText>
        <AppText>FPS: {quality.fps}</AppText>
      </AppCard>
      <AppText variant="caption">Abra /settings/quality para ajustar bitrate, resolução e FPS.</AppText>
    </Screen>
  );
}
