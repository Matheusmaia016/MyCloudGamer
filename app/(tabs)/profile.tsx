import { Link } from 'expo-router';

import { Screen } from '@/components/layout/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { useAuthStore } from '@/store/authStore';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <Screen scroll>
      <AppText variant="h2">Perfil</AppText>
      <AppCard>
        <AppText variant="h3">{user?.name ?? 'Convidado'}</AppText>
        <AppText variant="caption">{user?.email ?? 'Sem e-mail'}</AppText>
      </AppCard>

      <Link href="/devices"><AppText>Dispositivos</AppText></Link>
      <Link href="/diagnostics"><AppText>Diagnóstico de conexão</AppText></Link>
      <Link href="/settings"><AppText>Configurações</AppText></Link>
      <Link href="/session/history"><AppText>Histórico de sessões</AppText></Link>

      <AppButton onPress={logout} title="Sair" />
    </Screen>
  );
}
