import { env } from '../config/env.js';
import { logger } from '../logger/index.js';

import { backendApi } from '../api/backend-api.js';

export class HeartbeatService {
  private timer: NodeJS.Timeout | null = null;

  start(hostId: string) {
    logger.info({ hostId, intervalMs: env.HEARTBEAT_INTERVAL_MS }, 'Iniciando heartbeat do host');

    const send = async () => {
      try {
        const fakeLatency = Math.floor(Math.random() * 20) + 10;
        await backendApi.sendHeartbeat(hostId, fakeLatency);
        logger.debug({ hostId, latencyMs: fakeLatency }, 'Heartbeat enviado');
      } catch (error) {
        logger.error({ error }, 'Erro ao enviar heartbeat');
      }
    };

    void send();
    this.timer = setInterval(() => void send(), env.HEARTBEAT_INTERVAL_MS);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      logger.info('Heartbeat interrompido');
    }
  }
}
