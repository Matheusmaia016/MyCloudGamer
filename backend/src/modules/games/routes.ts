import type { FastifyInstance } from 'fastify';

export async function gameRoutes(app: FastifyInstance) {
  app.get('/games', { preHandler: [app.authenticate] }, async () => {
    const games = await app.prisma.game.findMany({ orderBy: { title: 'asc' } });
    return { games };
  });
}
