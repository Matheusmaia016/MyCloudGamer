import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';

export default function SessionScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();

  return (
    <Screen>
      <AppText variant="h2">Sessão de jogo</AppText>
      <AppCard>
        <View style={styles.streamPlaceholder}>
          <AppText>🎬 Placeholder de stream</AppText>
          <AppText variant="caption">Session ID: {sessionId}</AppText>
        </View>
      </AppCard>
      <AppButton onPress={() => {}} title="Encerrar sessão" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  streamPlaceholder: {
    backgroundColor: '#000',
    borderRadius: 12,
    minHeight: 220,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
});
