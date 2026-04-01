import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

const registerMobileSchema = z.object({
  name: z.string().min(2),
  platform: z.string().min(2),
  pushToken: z.string().optional(),
});

export async function deviceRoutes(app: FastifyInstance) {
  app.post('/devices/mobile', { preHandler: [app.authenticate] }, async (request: any, reply) => {
    const body = registerMobileSchema.parse(request.body);

    const device = await app.prisma.mobileDevice.create({
      data: {
        userId: request.user.sub,
        name: body.name,
        platform: body.platform,
        pushToken: body.pushToken,
      },
    });

    return reply.status(201).send({ device });
  });

  app.get('/devices/mobile', { preHandler: [app.authenticate] }, async (request: any) => {
    const devices = await app.prisma.mobileDevice.findMany({ where: { userId: request.user.sub } });
    return { devices };
  });
}
