import type { Host } from '@/types/entities';

export const mockHosts: Host[] = [
  { id: 'host-main', name: 'PC Gamer do Quarto', status: 'online', latencyMs: 18 },
  { id: 'host-office', name: 'Desktop Escritório', status: 'offline', latencyMs: 0 },
];
