import { useState } from 'react';

import { router } from 'expo-router';

import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppInput } from '@/components/ui/AppInput';
import { AppText } from '@/components/ui/AppText';

export default function PairPcScreen() {
  const [code, setCode] = useState('');
  const [paired, setPaired] = useState(false);

  const onPair = () => {
    if (code.trim().length < 6) return;
    setPaired(true);
  };

  return (
    <Screen>
      <AppText variant="h2">Parear PC host</AppText>
      <AppCard>
        <AppText variant="caption">Digite o código exibido no agente desktop do seu computador.</AppText>
      </AppCard>
      <AppInput onChangeText={setCode} placeholder="Código de pareamento" value={code} />
      <AppButton onPress={onPair} title="Parear" />
      {paired ? <AppText>Host pareado com sucesso ✅</AppText> : null}
      <AppButton onPress={() => router.replace('/(tabs)/home')} title="Ir para Home" />
    </Screen>
  );
}
