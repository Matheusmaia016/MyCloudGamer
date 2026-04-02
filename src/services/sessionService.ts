import type { Session } from '@/types/entities';

import { fetchSessionsMock, startSessionMock } from '@/services/mock/session.mock';
import { useAuthStore } from '@/store/authStore';

import { gamemirrorApi } from './api/gamemirrorApi';

let localSessions: Session[] = [];

export const sessionService = {
  async listHistory(): Promise<Session[]> {
    const token = useAuthStore.getState().token ?? undefined;
    try {
      const history = await gamemirrorApi.listSessionHistory(token);
      return [...localSessions, ...history.filter((item) => !localSessions.some((local) => local.id === item.id))];
    } catch {
      const mockHistory = await fetchSessionsMock();
      return [...localSessions, ...mockHistory.filter((item) => !localSessions.some((local) => local.id === item.id))];
    }
  },
  async startGameSession(gameId: string, hostId: string): Promise<{ session: Session; stream?: { moonlightUri?: string; instructions?: string } }> {
    const token = useAuthStore.getState().token ?? undefined;
    try {
      const response = await gamemirrorApi.startSession(gameId, hostId, token);
      localSessions = [response.session, ...localSessions.filter((item) => item.id !== response.session.id)];
      return { session: response.session, stream: response.stream };
    } catch {
      const result = await startSessionMock(gameId);
      const session: Session = {
        id: result.sessionId,
        gameId,
        gameTitle: 'Sessão Mock',
        hostId,
        startedAt: new Date().toISOString(),
        status: 'starting',
      };
      localSessions = [session, ...localSessions.filter((item) => item.id !== session.id)];
      return {
        session,
        stream: {
          moonlightUri: `moonlight://stream?game=${encodeURIComponent(gameId)}`,
          instructions: 'Instale o Moonlight para iniciar o streaming real quando a integração estiver habilitada.',
        },
      };
    }
  },
};
