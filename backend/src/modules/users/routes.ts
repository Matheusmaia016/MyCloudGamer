import type { FastifyInstance } from 'fastify';

export async function userRoutes(app: FastifyInstance) {
  app.get('/users/me', { preHandler: [app.authenticate] }, async (request: any) => {
    const user = await app.prisma.user.findUnique({
      where: { id: request.user.sub },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    return { user };
  });
}
