import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { AppError } from '../../utils/http-errors.js';

const startSessionSchema = z.object({
  hostId: z.string().min(1),
  gameId: z.string().min(1),
});

const finishSessionSchema = z.object({
  status: z.enum(['completed', 'failed']).default('completed'),
});

export async function sessionRoutes(app: FastifyInstance) {
  app.post('/sessions/start', { preHandler: [app.authenticate] }, async (request: any, reply) => {
    const body = startSessionSchema.parse(request.body);

    const host = await app.prisma.hostDevice.findFirst({ where: { id: body.hostId, userId: request.user.sub } });
    if (!host) throw new AppError('Host não encontrado para este usuário', 404);
    if (!host.isOnline) throw new AppError('Host precisa estar online para iniciar sessão', 409);

    const session = await app.prisma.session.create({
      data: {
        userId: request.user.sub,
        hostId: host.id,
        gameId: body.gameId,
        status: 'active',
      },
    });

    await app.prisma.userLibrary.updateMany({
      where: { userId: request.user.sub, gameId: body.gameId },
      data: { lastPlayedAt: new Date() },
    });

    app.websocketServer.broadcastToUser(request.user.sub, {
      type: 'session.started',
      payload: { sessionId: session.id, hostId: host.id, gameId: body.gameId },
    });

    return reply.status(201).send({ session });
  });

  app.post('/sessions/:id/end', { preHandler: [app.authenticate] }, async (request: any) => {
    const params = z.object({ id: z.string().min(1) }).parse(request.params);
    const body = finishSessionSchema.parse(request.body);

    const session = await app.prisma.session.findFirst({ where: { id: params.id, userId: request.user.sub } });
    if (!session) throw new AppError('Sessão não encontrada', 404);
    if (session.status !== 'active') throw new AppError('Sessão já foi encerrada', 409);

    const endedAt = new Date();
    const updated = await app.prisma.session.update({
      where: { id: session.id },
      data: { status: body.status, endedAt },
    });

    await app.prisma.sessionHistory.create({
      data: {
        userId: session.userId,
        hostId: session.hostId,
        gameId: session.gameId,
        startedAt: session.startedAt,
        endedAt,
        status: body.status,
      },
    });

    app.websocketServer.broadcastToUser(request.user.sub, {
      type: 'session.ended',
      payload: { sessionId: updated.id, status: body.status },
    });

    return { session: updated };
  });

  app.get('/sessions/history', { preHandler: [app.authenticate] }, async (request: any) => {
    const history = await app.prisma.sessionHistory.findMany({
      where: { userId: request.user.sub },
      include: { game: true },
      orderBy: { startedAt: 'desc' },
      take: 100,
    });
    return { history };
  });

  app.get('/sessions/last', { preHandler: [app.authenticate] }, async (request: any) => {
    const last = await app.prisma.session.findFirst({
      where: { userId: request.user.sub },
      orderBy: { startedAt: 'desc' },
    });

    return { session: last };
  });
}
