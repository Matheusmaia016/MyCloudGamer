import { backendApi } from '../api/backend-api.js';
import { LocalAgentServer } from '../api/local-server.js';
import { HostAuthService } from '../auth/host-auth.service.js';
import { GamesService } from '../games/games.service.js';
import { HeartbeatService } from '../heartbeat/heartbeat.service.js';
import { logger } from '../logger/index.js';
import { SessionService } from '../session/session.service.js';
import { collectDeviceInfo } from '../utils/device.js';

export class AgentService {
  private readonly authService = new HostAuthService();
  private readonly heartbeatService = new HeartbeatService();
  private readonly gamesService = new GamesService();
  private readonly sessionService = new SessionService();
  private readonly localServer = new LocalAgentServer(
    this.sessionService,
    () => this.gamesService.listLibrary(),
    () => collectDeviceInfo(),
  );

  public async start() {
    logger.info('Iniciando GameMirror Host Agent');

    const host = await this.authService.loginOrRegisterHost();
    const games = await this.gamesService.listLibrary();
    const device = collectDeviceInfo();

    try {
      await backendApi.sendDeviceInfo(host.id, device);
    } catch (error) {
      logger.warn({ error }, 'Não foi possível enviar dados do dispositivo (endpoint futuro)');
    }

    try {
      await backendApi.sendLibrary(host.id, games);
    } catch (error) {
      logger.warn({ error }, 'Não foi possível enviar biblioteca do host');
    }

    this.heartbeatService.start(host.id);
    await this.localServer.start();

    logger.info({ host, games: games.length, device }, 'Host-agent online no PC real');
  }

  public async stop() {
    this.heartbeatService.stop();
    await this.localServer.stop();
    logger.info('Host Agent finalizado');
  }
}
