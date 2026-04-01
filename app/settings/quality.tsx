import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { useSettingsStore } from '@/store/settingsStore';

export default function QualitySettingsScreen() {
  const quality = useSettingsStore((s) => s.quality);
  const setBitrate = useSettingsStore((s) => s.setBitrate);
  const setResolution = useSettingsStore((s) => s.setResolution);
  const setFps = useSettingsStore((s) => s.setFps);

  return (
    <Screen scroll>
      <AppText variant="h2">Qualidade de streaming</AppText>

      <AppCard>
        <AppText variant="h3">Bitrate ({quality.bitrateKbps} kbps)</AppText>
        <AppButton onPress={() => setBitrate(8000)} title="8.000" />
        <AppButton onPress={() => setBitrate(12000)} title="12.000" />
        <AppButton onPress={() => setBitrate(20000)} title="20.000" />
      </AppCard>

      <AppCard>
        <AppText variant="h3">Resolução ({quality.resolution})</AppText>
        <AppButton onPress={() => setResolution('720p')} title="720p" />
        <AppButton onPress={() => setResolution('1080p')} title="1080p" />
        <AppButton onPress={() => setResolution('1440p')} title="1440p" />
      </AppCard>

      <AppCard>
        <AppText variant="h3">FPS ({quality.fps})</AppText>
        <AppButton onPress={() => setFps(30)} title="30 FPS" />
        <AppButton onPress={() => setFps(60)} title="60 FPS" />
        <AppButton onPress={() => setFps(120)} title="120 FPS" />
      </AppCard>
    </Screen>
  );
}
