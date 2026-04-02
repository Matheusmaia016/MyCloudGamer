import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';

import { SunshineService } from '../integrations/sunshine/sunshine.service.js';
import { logger } from '../logger/index.js';
import type { SessionRequest, SessionState } from '../types/index.js';

/**
 * Sessão real/mista:
 * - tenta executar o jogo por caminho configurado
 * - prepara metadados para integração Sunshine/Moonlight
 */
export class SessionService {
  private currentSession: SessionState | null = null;
  private readonly sunshineService = new SunshineService();

  public async startSession(request: SessionRequest): Promise<SessionState> {
    if (this.currentSession?.status === 'active') {
      throw new Error('Já existe uma sessão ativa neste host');
    }

    if (request.executablePath) {
      try {
        spawn(request.executablePath, [], { detached: true, stdio: 'ignore' }).unref();
        logger.info({ executablePath: request.executablePath }, 'Comando de execução do jogo enviado ao SO');
      } catch (error) {
        logger.error({ error, executablePath: request.executablePath }, 'Falha ao executar jogo');
      }
    }

    const sunshine = await this.sunshineService.prepareStreamingSession({
      gameId: request.gameId,
      executablePath: request.executablePath,
    });

    const session: SessionState = {
      id: randomUUID(),
      gameId: request.gameId,
      status: 'active',
      streamPlaceholderUrl: sunshine.moonlightUri,
      startedAt: new Date().toISOString(),
    };

    this.currentSession = session;
    logger.info({ sessionId: session.id, gameId: request.gameId, sunshine }, 'Sessão preparada para integração Sunshine/Moonlight');

    return session;
  }

  public async startRemoteSessionMock(
    backendSessionId: string,
    updateStatus: (status: 'preparing_host' | 'connecting' | 'ready' | 'error') => Promise<void>,
  ) {
    try {
      await updateStatus('preparing_host');
      await new Promise((resolve) => setTimeout(resolve, 800));
      await updateStatus('connecting');
      await new Promise((resolve) => setTimeout(resolve, 900));
      await updateStatus('ready');
      logger.info({ backendSessionId }, 'Sessão remota mock pronta');
    } catch (error) {
      await updateStatus('error');
      logger.error({ backendSessionId, error }, 'Falha ao iniciar sessão remota mock');
    }
  }

  public stopSession(): SessionState {
    if (!this.currentSession || this.currentSession.status !== 'active') {
      throw new Error('Não existe sessão ativa');
    }

    this.currentSession = {
      ...this.currentSession,
      status: 'stopped',
    };

    logger.info({ sessionId: this.currentSession.id }, 'Sessão encerrada no host-agent');

    return this.currentSession;
  }

  public getCurrentSession(): SessionState | null {
    return this.currentSession;
  }
}
