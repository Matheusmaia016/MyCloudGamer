import type { FastifyInstance } from 'fastify';

export async function libraryRoutes(app: FastifyInstance) {
  app.get('/library', { preHandler: [app.authenticate] }, async (request: any) => {
    const library = await app.prisma.userLibrary.findMany({
      where: { userId: request.user.sub },
      include: { game: true },
      orderBy: { createdAt: 'desc' },
    });

    return { library };
  });
}
