import type { ConnectionDiagnostics, Game, Host, Session } from '@/types/entities';

import { apiRequest } from './client';

interface HostApiPayload {
  id: string;
  name: string;
  isOnline: boolean;
  lastSeenAt?: string;
  latencyMs?: number;
  status?: 'online' | 'offline';
}

interface StartSessionResponse {
  session: Session;
  stream?: {
    moonlightUri?: string;
    hostAddress?: string;
    instructions?: string;
  };
}

const toHost = (host: HostApiPayload): Host => ({
  id: host.id,
  name: host.name,
  status: host.status ?? (host.isOnline ? 'online' : 'offline'),
  latencyMs: host.latencyMs ?? 0,
  isOnline: host.isOnline,
  lastSeenAt: host.lastSeenAt,
});

export const gamemirrorApi = {
  listGames: () => apiRequest<{ games: Game[] }>('/games').then((r) => r.games),
  listHosts: (token?: string) =>
    apiRequest<{ hosts: HostApiPayload[] }>('/hosts', {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }).then((r) => r.hosts.map(toHost)),
  listHostGames: (hostId: string, token?: string) =>
    apiRequest<{ games: Game[] }>(`/hosts/${hostId}/games`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }).then((r) => r.games),
  listSessionHistory: (token?: string) =>
    apiRequest<{ history: Session[] }>('/sessions/history', {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }).then((r) => r.history),
  startSession: (gameId: string, hostId: string, token?: string) =>
    apiRequest<StartSessionResponse>('/sessions/start', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: JSON.stringify({ gameId, hostId }),
    }),
  pairHost: (code: string) =>
    apiRequest<{ host: HostApiPayload }>('/hosts/register', {
      method: 'POST',
      body: JSON.stringify({
        pairingCode: code,
        hostName: 'PC Usuário',
        os: 'Windows 11',
        uniqueKey: `mobile-${code}`,
      }),
    }).then((r) => toHost(r.host)),
  runDiagnostics: () =>
    Promise.resolve<ConnectionDiagnostics>({
      pingMs: 24,
      jitterMs: 7,
      packetLossPercent: 0.4,
      recommendedProfile: 'balanced',
    }),
};
