import { Redirect } from 'expo-router';

import { useAuthStore } from '@/store/authStore';

export default function IndexPage() {
  const token = useAuthStore((s) => s.token);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  if (!isHydrated) return <Redirect href="/splash" />;
  return <Redirect href={token ? '/(tabs)/home' : '/(auth)/login'} />;
}
