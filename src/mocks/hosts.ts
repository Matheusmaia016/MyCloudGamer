import type { Host } from '@/types/entities';

export const mockHosts: Host[] = [
  { id: 'host-main', name: 'PC Gamer do Quarto', status: 'online', latencyMs: 18, isOnline: true, lastSeenAt: new Date().toISOString() },
  { id: 'host-office', name: 'Desktop Escritório', status: 'offline', latencyMs: 0, isOnline: false, lastSeenAt: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
];
