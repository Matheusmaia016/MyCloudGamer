import { env } from '../config/env.js';
import type { HostGame, HostInfo } from '../types/index.js';

import { apiRequest } from './http-client.js';

export interface RegisterHostInput {
  pairingCode: string;
  hostName: string;
  os: string;
  uniqueKey: string;
}

export const backendApi = {
  registerHost: (payload: RegisterHostInput) =>
    apiRequest<{ host: HostInfo }>(`${env.BACKEND_URL}/hosts/register`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  sendHeartbeat: (hostId: string, latencyMs: number) =>
    apiRequest<{ ok: boolean }>(`${env.BACKEND_URL}/hosts/heartbeat`, {
      method: 'POST',
      body: JSON.stringify({ hostId, latencyMs }),
    }),

  sendDeviceInfo: (hostId: string, device: Record<string, unknown>) =>
    apiRequest<{ ok: boolean }>(`${env.BACKEND_URL}/hosts/${hostId}/device-info`, {
      method: 'POST',
      body: JSON.stringify({ device }),
    }),

  sendLibrary: (hostId: string, games: HostGame[]) =>
    apiRequest<{ ok: boolean }>(`${env.BACKEND_URL}/hosts/${hostId}/library`, {
      method: 'POST',
      body: JSON.stringify({ games }),
    }),

  updateSessionStatus: (sessionId: string, status: 'preparing_host' | 'connecting' | 'ready' | 'error') =>
    apiRequest<{ session: { id: string; status: string } }>(`${env.BACKEND_URL}/sessions/${sessionId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    }),
};
