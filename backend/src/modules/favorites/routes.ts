import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

const favoriteSchema = z.object({
  gameId: z.string().min(1),
});

export async function favoriteRoutes(app: FastifyInstance) {
  app.get('/favorites', { preHandler: [app.authenticate] }, async (request: any) => {
    const favorites = await app.prisma.favorite.findMany({
      where: { userId: request.user.sub },
      include: { game: true },
      orderBy: { createdAt: 'desc' },
    });

    return { favorites };
  });

  app.post('/favorites', { preHandler: [app.authenticate] }, async (request: any, reply) => {
    const body = favoriteSchema.parse(request.body);
    const favorite = await app.prisma.favorite.upsert({
      where: { userId_gameId: { userId: request.user.sub, gameId: body.gameId } },
      update: {},
      create: { userId: request.user.sub, gameId: body.gameId },
    });
    return reply.status(201).send({ favorite });
  });

  app.delete('/favorites/:gameId', { preHandler: [app.authenticate] }, async (request: any, reply) => {
    const params = z.object({ gameId: z.string().min(1) }).parse(request.params);
    await app.prisma.favorite.deleteMany({ where: { userId: request.user.sub, gameId: params.gameId } });
    return reply.status(204).send();
  });
}
