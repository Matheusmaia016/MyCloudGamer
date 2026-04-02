import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(2),
  bitrateKbps: z.number().int().min(2000).max(50000),
  resolution: z.enum(['720p', '1080p', '1440p']),
  fps: z.number().int().min(30).max(120),
  isDefault: z.boolean().default(false),
});

export async function connectionProfileRoutes(app: FastifyInstance) {
  app.get('/connection-profiles', { preHandler: [app.authenticate] }, async (request: any) => {
    const profiles = await app.prisma.connectionProfile.findMany({
      where: { userId: request.user.sub },
      orderBy: [{ isDefault: 'desc' }, { updatedAt: 'desc' }],
    });
    return { profiles };
  });

  app.post('/connection-profiles', { preHandler: [app.authenticate] }, async (request: any, reply) => {
    const body = profileSchema.parse(request.body);

    if (body.isDefault) {
      await app.prisma.connectionProfile.updateMany({ where: { userId: request.user.sub }, data: { isDefault: false } });
    }

    const profile = await app.prisma.connectionProfile.create({
      data: { ...body, userId: request.user.sub },
    });

    return reply.status(201).send({ profile });
  });
}
