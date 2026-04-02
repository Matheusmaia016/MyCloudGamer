import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { AppError } from '../../utils/http-errors.js';

const heartbeatSchema = z.object({
  hostId: z.string().min(1),
  latencyMs: z.number().int().nonnegative().default(0),
});

const registerSchema = z.object({
  pairingCode: z.string().min(6),
  hostName: z.string().min(2),
  os: z.string().min(2),
  uniqueKey: z.string().min(4),
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

const OFFLINE_THRESHOLD_MS = 15_000;

export async function hostRoutes(app: FastifyInstance) {
  app.post('/hosts/register', async (request, reply) => {
    const body = registerSchema.parse(request.body);

    const pairing = await app.prisma.pairingCode.findUnique({ where: { code: body.pairingCode } });
    if (!pairing) throw new AppError('Código de pareamento inválido', 404);
    if (pairing.consumedAt) throw new AppError('Código de pareamento já consumido', 409);
    if (pairing.expiresAt < new Date()) throw new AppError('Código de pareamento expirado', 410);

    const host = await app.prisma.hostDevice.upsert({
      where: { uniqueKey: body.uniqueKey },
      update: {
        userId: pairing.userId,
        name: body.hostName,
        os: body.os,
        isOnline: true,
        lastSeenAt: new Date(),
      },
      create: {
        userId: pairing.userId,
        name: body.hostName,
        os: body.os,
        uniqueKey: body.uniqueKey,
        isOnline: true,
        lastSeenAt: new Date(),
      },
    });

    await app.prisma.pairingCode.update({
      where: { id: pairing.id },
      data: { consumedAt: new Date(), hostId: host.id },
    });

    return reply.status(201).send({ host });
  });

  app.get('/hosts', { preHandler: [app.authenticate] }, async (request: any) => {
    const hosts = await app.prisma.hostDevice.findMany({
      where: { userId: request.user.sub },
      orderBy: { updatedAt: 'desc' },
    });

    const now = Date.now();

    const normalized = hosts.map((host) => {
      const onlineByHeartbeat = !!host.lastSeenAt && now - host.lastSeenAt.getTime() < OFFLINE_THRESHOLD_MS;
      return {
        ...host,
        isOnline: host.isOnline && onlineByHeartbeat,
        status: host.isOnline && onlineByHeartbeat ? 'online' : 'offline',
      };
    });

    return { hosts: normalized };
  });

  app.get('/hosts/:hostId/games', { preHandler: [app.authenticate] }, async (request: any) => {
    const params = z.object({ hostId: z.string().min(1) }).parse(request.params);

    const host = await app.prisma.hostDevice.findFirst({ where: { id: params.hostId, userId: request.user.sub } });
    if (!host) throw new AppError('Host não encontrado para usuário', 404);

    const library = await app.prisma.userLibrary.findMany({
      where: { userId: request.user.sub },
      include: { game: true },
      orderBy: { createdAt: 'desc' },
    });

    return { games: library.map((item) => item.game) };
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
      payload: { hostId: body.hostId, isOnline: true, latencyMs: body.latencyMs, lastHeartbeatAt: new Date().toISOString() },
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
