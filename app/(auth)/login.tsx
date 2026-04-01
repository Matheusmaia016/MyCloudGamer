import { useState } from 'react';

import { Link, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { AppText } from '@/components/ui/AppText';
import { useAuthStore } from '@/store/authStore';

export default function LoginScreen() {
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);

  const [email, setEmail] = useState('demo@gamemirror.app');
  const [password, setPassword] = useState('123456');

  const onSubmit = async () => {
    try {
      await login(email.trim(), password);
      router.replace('/(onboarding)/welcome');
    } catch {
      // erro tratado no store
    }
  };

  return (
    <Screen>
      <View style={styles.top}>
        <AppText variant="h1">Entrar</AppText>
        <AppText variant="caption">Acesse seu PC gamer em qualquer lugar.</AppText>
      </View>

      <AppInput autoCapitalize="none" keyboardType="email-address" onChangeText={setEmail} placeholder="Email" value={email} />
      <AppInput onChangeText={setPassword} placeholder="Senha" secureTextEntry value={password} />

      {error ? <AppText style={styles.error}>{error}</AppText> : null}

      <AppButton disabled={loading} onPress={onSubmit} title={loading ? 'Entrando...' : 'Entrar'} />

      <Link href="/(auth)/signup">
        <AppText style={styles.link}>Não tem conta? Criar agora</AppText>
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { marginTop: 28, marginBottom: 12, gap: 4 },
  error: { color: '#FF6B7A' },
  link: { textAlign: 'center', marginTop: 8, color: '#A5AFCA' },
});
