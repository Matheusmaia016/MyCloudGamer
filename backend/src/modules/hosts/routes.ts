import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { AppError } from '../../utils/http-errors.js';

const heartbeatSchema = z.object({
  hostId: z.string().min(1),
  latencyMs: z.number().int().nonnegative().default(0),
});

const deviceInfoSchema = z.object({
  device: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])),
});

const hostLibrarySchema = z.object({
  games: z.array(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      genre: z.string().min(1),
      executablePath: z.string().min(1),
    }),
  ),
});

export async function hostRoutes(app: FastifyInstance) {
  app.get('/hosts', { preHandler: [app.authenticate] }, async (request: any) => {
    const hosts = await app.prisma.hostDevice.findMany({
      where: { userId: request.user.sub },
      orderBy: { updatedAt: 'desc' },
    });

    return { hosts };
  });

  app.post('/hosts/heartbeat', async (request, reply) => {
    const body = heartbeatSchema.parse(request.body);

    const host = await app.prisma.hostDevice.findUnique({ where: { id: body.hostId } });
    if (!host) throw new AppError('Host não encontrado', 404);

    await app.prisma.hostDevice.update({
      where: { id: body.hostId },
      data: { isOnline: true, lastSeenAt: new Date() },
    });

    app.websocketServer.broadcastToUser(host.userId, {
      type: 'host.presence.updated',
      payload: { hostId: body.hostId, isOnline: true, latencyMs: body.latencyMs },
    });

    return reply.send({ ok: true });
  });

  app.post('/hosts/:hostId/device-info', async (request: any, reply) => {
    const params = z.object({ hostId: z.string().min(1) }).parse(request.params);
    const body = deviceInfoSchema.parse(request.body);

    const host = await app.prisma.hostDevice.findUnique({ where: { id: params.hostId } });
    if (!host) throw new AppError('Host não encontrado', 404);

    app.log.info({ hostId: host.id, device: body.device }, 'Metadados do host recebidos');

    return reply.send({ ok: true });
  });

  app.post('/hosts/:hostId/library', async (request: any, reply) => {
    const params = z.object({ hostId: z.string().min(1) }).parse(request.params);
    const body = hostLibrarySchema.parse(request.body);

    const host = await app.prisma.hostDevice.findUnique({ where: { id: params.hostId } });
    if (!host) throw new AppError('Host não encontrado', 404);

    await Promise.all(
      body.games.map(async (game) => {
        await app.prisma.game.upsert({
          where: { id: game.id },
          update: { title: game.title, genre: game.genre },
          create: {
            id: game.id,
            title: game.title,
            genre: game.genre,
            coverUrl: `local://${game.executablePath}`,
          },
        });

        await app.prisma.userLibrary.upsert({
          where: { userId_gameId: { userId: host.userId, gameId: game.id } },
          update: {},
          create: { userId: host.userId, gameId: game.id },
        });
      }),
    );

    app.websocketServer.broadcastToUser(host.userId, {
      type: 'host.library.updated',
      payload: { hostId: host.id, totalGames: body.games.length },
    });

    return reply.send({ ok: true, imported: body.games.length });
  });
}
