import { randomUUID } from 'node:crypto';

import { logger } from '../logger/index.js';
import type { SessionRequest, SessionState } from '../types/index.js';

/**
 * Sessão mock pronta para evolução:
 * - hoje cria placeholder local de stream
 * - futuro: encapsular integração Sunshine (start stream, attach input, stop stream)
 */
export class SessionService {
  private currentSession: SessionState | null = null;

  public startSession(request: SessionRequest): SessionState {
    if (this.currentSession?.status === 'active') {
      throw new Error('Já existe uma sessão ativa neste host');
    }

    const session: SessionState = {
      id: randomUUID(),
      gameId: request.gameId,
      status: 'active',
      streamPlaceholderUrl: 'ws://localhost:7878/stream-placeholder',
      startedAt: new Date().toISOString(),
    };

    this.currentSession = session;
    logger.info({ sessionId: session.id, gameId: request.gameId }, 'Sessão mock iniciada');

    return session;
  }

  public stopSession(): SessionState {
    if (!this.currentSession || this.currentSession.status !== 'active') {
      throw new Error('Não existe sessão ativa');
    }

    this.currentSession = {
      ...this.currentSession,
      status: 'stopped',
    };

    logger.info({ sessionId: this.currentSession.id }, 'Sessão mock encerrada');

    return this.currentSession;
  }

  public getCurrentSession(): SessionState | null {
    return this.currentSession;
  }
}
