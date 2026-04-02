import { router } from 'expo-router';
import { View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';

export default function WelcomeScreen() {
  return (
    <Screen>
      <View style={{ gap: 8, marginTop: 30 }}>
        <AppText variant="h1">Bem-vindo ao GameMirror</AppText>
        <AppText variant="caption">Transforme seu PC em nuvem pessoal para jogar no celular.</AppText>
      </View>

      <AppCard>
        <AppText variant="h3">1. Pareie seu computador</AppText>
        <AppText variant="caption">Conecte seu host com segurança em poucos passos.</AppText>
      </AppCard>

      <AppCard>
        <AppText variant="h3">2. Ajuste qualidade</AppText>
        <AppText variant="caption">Defina bitrate, resolução e FPS conforme sua rede.</AppText>
      </AppCard>

      <AppButton onPress={() => router.push('/pair-pc')} title="Começar" />
      <AppButton onPress={() => router.replace('/(tabs)/home')} title="Pular por agora" />
    </Screen>
  );
}
