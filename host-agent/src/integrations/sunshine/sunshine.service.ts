import { logger } from '../../logger/index.js';

import type { SunshineLaunchRequest, SunshineLaunchResult } from './types.js';

/**
 * Abstração de integração Sunshine.
 * Nesta etapa apenas prepara os dados necessários para integração real.
 */
export class SunshineService {
  async prepareStreamingSession(request: SunshineLaunchRequest): Promise<SunshineLaunchResult> {
    logger.info({ gameId: request.gameId, executablePath: request.executablePath }, 'Preparando sessão para Sunshine (modo integração)');

    return {
      streamReady: true,
      hostAddress: '127.0.0.1',
      moonlightUri: `moonlight://stream?game=${encodeURIComponent(request.gameId)}`,
      notes: 'Integração Sunshine pendente: autenticação host, mapeamento appId e start real do stream.',
    };
  }
}
