import Fastify from 'fastify';
import { z } from 'zod';

import { env } from '../config/env.js';
import { logger } from '../logger/index.js';
import type { HostGame } from '../types/index.js';

import { SessionService } from '../session/session.service.js';

const startSessionSchema = z.object({
  gameId: z.string().min(1),
  userId: z.string().optional(),
});

export class LocalAgentServer {
  private readonly app = Fastify({ logger: false });

  constructor(
    private readonly sessionService: SessionService,
    private readonly getHostGames: () => HostGame[],
    private readonly getDeviceInfo: () => Record<string, unknown>,
  ) {
    this.registerRoutes();
  }

  private registerRoutes() {
    this.app.get('/health', async () => ({ ok: true, service: 'gamemirror-host-agent' }));

    this.app.get('/games/library', async () => ({ games: this.getHostGames() }));

    this.app.get('/device/info', async () => ({ device: this.getDeviceInfo() }));

    this.app.get('/session/current', async () => ({ session: this.sessionService.getCurrentSession() }));

    this.app.post('/session/start', async (request, reply) => {
      try {
        const body = startSessionSchema.parse(request.body);
        const session = this.sessionService.startSession(body);
        return reply.status(201).send({ session });
      } catch (error) {
        return reply.status(400).send({ message: error instanceof Error ? error.message : 'Erro ao iniciar sessão' });
      }
    });

    this.app.post('/session/stop', async (_request, reply) => {
      try {
        const session = this.sessionService.stopSession();
        return reply.send({ session });
      } catch (error) {
        return reply.status(400).send({ message: error instanceof Error ? error.message : 'Erro ao encerrar sessão' });
      }
    });
  }

  public async start() {
    await this.app.listen({ host: '0.0.0.0', port: env.AGENT_PORT });
    logger.info({ port: env.AGENT_PORT }, 'Servidor local do host-agent iniciado');
  }

  public async stop() {
    await this.app.close();
  }
}
