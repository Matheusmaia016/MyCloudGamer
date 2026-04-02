import type { Game, Host } from '@/types/entities';

import { fetchHostsMock, runDiagnosticsMock } from '@/services/mock/host.mock';
import { useAuthStore } from '@/store/authStore';

import { gamemirrorApi } from './api/gamemirrorApi';

let localPairedHosts: Host[] = [];

export const hostService = {
  async listHosts(): Promise<Host[]> {
    const token = useAuthStore.getState().token ?? undefined;

    try {
      const apiHosts = await gamemirrorApi.listHosts(token);
      return [...localPairedHosts, ...apiHosts.filter((h) => !localPairedHosts.some((lp) => lp.id === h.id))];
    } catch {
      const mockHosts = await fetchHostsMock();
      return [...localPairedHosts, ...mockHosts.filter((h) => !localPairedHosts.some((lp) => lp.id === h.id))];
    }
  },
  async listHostGames(hostId: string): Promise<Game[]> {
    const token = useAuthStore.getState().token ?? undefined;
    try {
      return await gamemirrorApi.listHostGames(hostId, token);
    } catch {
      return [];
    }
  },
  async pairHost(code: string): Promise<Host> {
    try {
      const host = await gamemirrorApi.pairHost(code);
      localPairedHosts = [host, ...localPairedHosts.filter((item) => item.id !== host.id)];
      return host;
    } catch {
      const host: Host = {
        id: `paired-${code}`,
        name: `PC pareado ${code}`,
        status: 'online',
        latencyMs: 20,
        isOnline: true,
        lastSeenAt: new Date().toISOString(),
      };
      localPairedHosts = [host, ...localPairedHosts.filter((item) => item.id !== host.id)];
      return host;
    }
  },
  async diagnostics() {
    try {
      return await gamemirrorApi.runDiagnostics();
    } catch {
      return runDiagnosticsMock();
    }
  },
};
