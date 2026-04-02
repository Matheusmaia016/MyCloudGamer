import os from 'node:os';

import { env } from '../config/env.js';
import { logger } from '../logger/index.js';
import type { HostInfo } from '../types/index.js';

import { backendApi } from '../api/backend-api.js';

export class HostAuthService {
  private host: HostInfo | null = null;

  public async loginOrRegisterHost(): Promise<HostInfo> {
    if (!env.PAIRING_CODE) {
      throw new Error('PAIRING_CODE não definido. Gere o código no app mobile antes de iniciar o agente.');
    }

    logger.info('Registrando host real no backend');

    const result = await backendApi.registerHost({
      pairingCode: env.PAIRING_CODE,
      hostName: os.hostname(),
      os: env.HOST_OS,
      uniqueKey: env.HOST_UNIQUE_KEY,
    });

    this.host = result.host;
    logger.info({ hostId: result.host.id, hostName: result.host.name }, 'Host autenticado/registrado com sucesso');

    return result.host;
  }

  public getHost(): HostInfo {
    if (!this.host) {
      throw new Error('Host ainda não autenticado');
    }
    return this.host;
  }
}
